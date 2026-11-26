import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SHORTCODE_PATTERN = /^[A-Za-z0-9_-]{6,20}$/;

/**
 * Resolves a direct progressive MP4 stream for a Katha reel:
 * 1. Serves local optimized `/public/reels/<code>.mp4` immediately (fastest, zero latency)
 * 2. Best-effort public mobile embed metadata lookup for future WordPress-added shortcodes
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;
  if (!SHORTCODE_PATTERN.test(code)) {
    return NextResponse.json({ error: 'Invalid reel code.' }, { status: 400 });
  }

  const localPath = path.join(process.cwd(), 'public', 'reels', `${code}.mp4`);
  if (fs.existsSync(localPath)) {
    return NextResponse.json({
      code,
      videoUrl: `/reels/${code}.mp4`,
      source: 'local',
    });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(
      `https://www.instagram.com/reel/${encodeURIComponent(code)}/embed/captioned/`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          Accept: 'text/html',
        },
        signal: controller.signal,
        next: { revalidate: 1800 },
      }
    );
    clearTimeout(timer);

    if (res.ok) {
      const html = await res.text();
      const match = html.match(/\\"video_url\\":\\"(https:[^"]+?)\\"/);
      if (match?.[1]) {
        const decoded = match[1]
          .replace(/\\\\\//g, '/')
          .replace(/\\\//g, '/')
          .replace(/\\\\u0026/g, '&')
          .replace(/\\u0026/g, '&');
        return NextResponse.json({
          code,
          videoUrl: decoded,
          source: 'resolved',
        });
      }
    }
  } catch {
    // Return null cleanly if upstream stream cannot be resolved
  }

  return NextResponse.json({
    code,
    videoUrl: null,
    source: 'unavailable',
  });
}
