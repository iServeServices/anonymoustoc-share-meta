import { NextRequest, NextResponse } from 'next/server';

// --- CONFIG YOU MUST FILL ---
const APP_SCHEME = 'anonymoustoc://ps?id=';
const IOS_STORE  = 'https://apps.apple.com/app/id6746080508';              // TODO replace
const AND_STORE  = 'https://play.google.com/store/apps/details?id=your.pkg'; // TODO replace
const FALLBACK   = 'https://www.anonymoustoc.com/';
// ----------------------------

// If you want Firestore now:
let useTemp = false;
try { require('@/lib/firestore'); } catch { useTemp = true; }

async function fetchPostText(id: string): Promise<string> {
  if (useTemp) {
    // TEMP: no Firestore yet—return a default string so you can test the flow
    return 'A whisper from the soul.';
  } else {
    const { db } = await import('@/lib/firestore');
    const snap = await db.collection('feeds').doc(id).get();
    const data = snap.exists ? (snap.data() as any) : null;
    return (data?.message || data?.caption || 'A whisper from the soul.').toString();
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, m =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'} as any)[m]
  );
}

import { truncate, buildOgImageUrl } from '@/lib/og';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id') || '';

  const message = id ? await fetchPostText(id) : 'It’s the soul that matters.';
  const desc = truncate(message, 180);
  const image = buildOgImageUrl(message);

  const deepLink = `${APP_SCHEME}${id}`;
  const ua = req.headers.get('user-agent') || '';
  const isiOS = /iPhone|iPad|iPod/i.test(ua);
  const storeUrl = isiOS ? IOS_STORE : AND_STORE;

  const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>AnonymousToc</title>
  <meta name="description" content="${escapeHtml(desc)}" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="AnonymousToc" />
  <meta property="og:description" content="${escapeHtml(desc)}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${FALLBACK}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="AnonymousToc" />
  <meta name="twitter:description" content="${escapeHtml(desc)}" />
  <meta name="twitter:image" content="${image}" />

  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Helvetica,Arial,sans-serif;margin:0;padding:32px;color:#111;background:#faf8f6}
    .card{max-width:640px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.08);padding:24px;text-align:center}
    .btn{display:inline-block;margin:8px 6px;padding:12px 18px;border-radius:10px;text-decoration:none;background:#0f766e;color:#fff}
    .muted{color:#666;margin-top:8px}
    img{max-width:100%;border-radius:12px}
  </style>
  <script>
    (function(){
      var timeout = setTimeout(function(){ window.location.href = '${storeUrl}'; }, 1500);
      window.location.href = '${deepLink}';
      setTimeout(function(){ clearTimeout(timeout); }, 2500);
    })();
  </script>
</head>
<body>
  <div class="card">
    <img src="${image}" alt="AnonymousToc" />
    <h2>AnonymousToc</h2>
    <p class="muted">${escapeHtml(desc)}</p>
    <p>
      <a class="btn" href="${deepLink}">Open in App</a>
      <a class="btn" href="${storeUrl}">Get the App</a>
    </p>
  </div>
</body>
</html>`.trim();

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' }});
}
