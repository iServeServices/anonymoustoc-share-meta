// Dynamic OG image for AnonymousToc
import { ImageResponse } from 'next/og';
import { NextResponse } from 'next/server';
import { getPostFromFirestore } from '../../../lib/firestore.js';

// Tell Next.js this is an edge function that returns an image
export const runtime = 'edge';
export const alt = 'AnonymousToc';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

function truncate(text, maxChars = 180) {
  const t = (text || '').trim();
  if (t.length <= maxChars) return t;
  return t.substring(0, maxChars).trimEnd() + '…';
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || '';
    if (!id) {
      return new ImageResponse(
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            background: 'linear-gradient(135deg,#f7e9f2,#f7f0ff,#e9f6ff)',
            padding: 64,
            fontFamily: 'Inter, system-ui, Arial',
            color: '#111',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 56, fontWeight: 700, textAlign: 'center' }}>
            AnonymousToc
            <div style={{ fontSize: 28, fontWeight: 400, marginTop: 12 }}>
              It’s the soul that matters.
            </div>
          </div>
        </div>,
        { ...size }
      );
    }

    // Fetch the post
    const post = await getPostFromFirestore(id);
    const rawCaption =
      (post && (post.caption || post.message || post.text)) || '';
    const snippet = truncate(rawCaption, 180);

    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg,#fde2f3,#f0ecff 50%, #e6f5ff)',
          padding: 60,
          fontFamily: 'Inter, system-ui, Arial',
          color: '#0b1020',
        }}
      >
        {/* Top tag */}
        <div style={{ fontSize: 28, opacity: 0.8, marginBottom: 20 }}>
          A whisper from AnonymousToc
        </div>

        {/* Card */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            borderRadius: 24,
            background: '#fff',
            boxShadow: '0 12px 40px rgba(0,0,0,.12)',
            padding: 48,
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 52, lineHeight: 1.25, fontWeight: 600 }}>
            {snippet || 'A quiet reflection from the soul.'}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 24,
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 28, opacity: 0.9 }}>
            It’s the soul that matters.
          </div>
          <div style={{ fontSize: 24, opacity: 0.7 }}>anonymoustoc.com</div>
        </div>
      </div>,
      { ...size }
    );
  } catch (err) {
    // Fallback image if anything goes wrong
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg,#f7e9f2,#f7f0ff,#e9f6ff)',
          padding: 64,
          fontFamily: 'Inter, system-ui, Arial',
          color: '#111',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 50, fontWeight: 700, textAlign: 'center' }}>
          AnonymousToc
          <div style={{ fontSize: 26, fontWeight: 400, marginTop: 10 }}>
            It’s the soul that matters.
          </div>
        </div>
      </div>,
      { ...size }
    );
  }
}
