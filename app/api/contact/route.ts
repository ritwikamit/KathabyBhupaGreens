import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_TOPICS = new Set([
  'General question',
  'Table enquiry',
  'Group visit',
  'Other',
]);

// Lightweight in-memory rate limit (per server instance)
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const ipHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const history = (ipHits.get(ip) || []).filter(
    (ts) => now - ts < RATE_WINDOW_MS
  );
  if (history.length >= MAX_REQUESTS_PER_WINDOW) {
    ipHits.set(ip, history);
    return true;
  }
  history.push(now);
  ipHits.set(ip, history);
  return false;
}

export async function POST(request: NextRequest) {
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      {
        error:
          'Too many enquiries sent from this connection. Please wait a few minutes or call Katha directly.',
      },
      { status: 429 }
    );
  }

  try {
    const contentLength = Number(request.headers.get('content-length') || '0');
    if (contentLength > 10_000) {
      return NextResponse.json(
        { error: 'Enquiry payload is too large.' },
        { status: 413 }
      );
    }

    const body = (await request.json()) as {
      name?: unknown;
      contact?: unknown;
      topic?: unknown;
      preferredDateTime?: unknown;
      message?: unknown;
      website?: unknown; // Honeypot field
    };

    // Silent drop if honeypot was filled by automated bots
    if (typeof body.website === 'string' && body.website.trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Thank you. Your enquiry has been recorded.',
      });
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const contact = typeof body.contact === 'string' ? body.contact.trim() : '';
    const topic = typeof body.topic === 'string' ? body.topic.trim() : '';
    const preferredDateTime =
      typeof body.preferredDateTime === 'string'
        ? body.preferredDateTime.trim().slice(0, 80)
        : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'Please enter your name (between 2 and 100 characters).' },
        { status: 400 }
      );
    }

    if (contact.length < 5 || contact.length > 120) {
      return NextResponse.json(
        { error: 'Please provide a valid phone number or email address.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TOPICS.has(topic)) {
      return NextResponse.json(
        { error: 'Please choose a valid enquiry topic.' },
        { status: 400 }
      );
    }

    if (message.length < 8 || message.length > 1500) {
      return NextResponse.json(
        { error: 'Please share a brief message (8 to 1500 characters).' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            restaurant: 'Katha by Bhupa Greens',
            name,
            contact,
            topic,
            preferredDateTime,
            message,
            receivedAt: new Date().toISOString(),
          }),
        });
      } catch {
        // Keep user feedback resilient if external forwarder is temporarily offline
      }
    }

    return NextResponse.json({
      success: true,
      message:
        'Thank you for writing to Katha by Bhupa Greens. The team will follow up using the contact details you shared. Submitting an enquiry does not automatically confirm a table reservation.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Could not read your enquiry. Please try again.' },
      { status: 400 }
    );
  }
}
