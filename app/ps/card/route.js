// app/ps/card/route.js
// Generates a 1200x630 open-graph image with the post snippet.
// We pass the snippet in the query as ?t=... from /ps, so this route
// does NOT need Firebase access (works on Edge).

export const runtime = 'edge'; // required for @vercel/og
export const alt = 'AnonymousToc';
export const contentType = 'image/png';

import { ImageResponse } from 'next/og';

// Basic truncation + safe default
const truncate = (t = '', n = 240) =>
  t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const t = searchParams.get('t') || 'It’s the soul that matters.';
  const text = truncate(decodeURIComponent(t));

  // Gentle warm gradient like your reference
  const bg = {
    backgroundImage:
      'linear-gradient(180deg, #EBC7F4 0%, #F4E1C1 55%, #F0E6C8 100%)',
  };

  return new ImageResponse(
    (
      <div
        style={{
          ...bg,
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px 96px',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 64,
            lineHeight: 1.2,
            color: '#102034',
            whiteSpace: 'pre-wrap',
          }}
        >
          {text}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            color: '#102034',
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: 28,
              opacity: 0.9,
              fontWeight: 600,
            }}
          >
            AnonymousToc
          </div>
          <div
            style={{
              fontSize: 22,
              opacity: 0.75,
            }}
          >
            share.anonymoustoc.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
