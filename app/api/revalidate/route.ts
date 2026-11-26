import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * WordPress Webhook Endpoint for On-Demand ISR Revalidation.
 * Configure your WordPress publish/update hook to POST JSON:
 * { "type": "menu" | "journal" | "gallery" | "all", "slug": "optional-slug" }
 * with header `x-revalidate-secret: <WP_REVALIDATE_SECRET>`.
 */
export async function POST(request: NextRequest) {
  const expectedSecret = process.env.WP_REVALIDATE_SECRET;
  if (!expectedSecret) {
    return NextResponse.json(
      { error: 'Revalidation secret is not configured on the server.' },
      { status: 503 }
    );
  }

  const providedSecret = request.headers.get('x-revalidate-secret') || '';
  if (!providedSecret || !safeEqual(providedSecret, expectedSecret)) {
    return NextResponse.json({ error: 'Unauthorized request.' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      type?: 'menu' | 'journal' | 'gallery' | 'all';
      slug?: string;
    };

    const revalidated: string[] = [];
    const type = body.type || 'all';

    if (type === 'menu' || type === 'all') {
      revalidateTag('menu');
      revalidateTag('menu-categories');
      revalidateTag('menu-items');
      revalidatePath('/menu');
      revalidatePath('/');
      revalidated.push('menu');
      if (body.slug && /^[a-z0-9-]+$/i.test(body.slug)) {
        revalidateTag(`menu-category-${body.slug}`);
        revalidatePath(`/menu/${body.slug}`);
        revalidated.push(`/menu/${body.slug}`);
      }
    }

    if (type === 'journal' || type === 'all') {
      revalidateTag('journal');
      revalidateTag('posts');
      revalidatePath('/journal');
      revalidatePath('/');
      revalidated.push('journal');
      if (body.slug && /^[a-z0-9-]+$/i.test(body.slug)) {
        revalidatePath(`/journal/${body.slug}`);
        revalidated.push(`/journal/${body.slug}`);
      }
    }

    if (type === 'gallery' || type === 'all') {
      revalidateTag('gallery');
      revalidatePath('/gallery');
      revalidated.push('gallery');
    }

    return NextResponse.json({
      revalidated: true,
      targets: revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid webhook payload.' },
      { status: 400 }
    );
  }
}
