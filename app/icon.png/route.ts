export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // For edge runtime, fetch the static file from public folder
    // Public folder files are served at root level in Next.js
    // We use the request URL to build the correct path
    const url = new URL(request.url);
    const iconUrl = new URL('/icon.png', url.origin);
    
    // Fetch the icon from the static public folder
    // This works in edge runtime because we're fetching from the same origin
    const response = await fetch(iconUrl.toString());
    
    if (!response.ok) {
      return new NextResponse('Icon not found', { status: 404 });
    }
    
    const iconBuffer = await response.arrayBuffer();
    
    return new NextResponse(iconBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    // Fallback: return 404 if icon not found
    return new NextResponse('Icon not found', { status: 404 });
  }
}

