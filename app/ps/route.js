// app/ps/route.js
export const dynamic = 'force-dynamic';

import { getPostFromFirestore } from '../../lib/firestore.js';
import { renderOGImage } from '../../lib/og.js';

const escapeHtml = (s = '') =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

// Short helper for safe defaults
const nonEmpty = (v, fallback = '') =>
  (typeof v === 'string' ? v : '').trim() || fallback;

export async function GET(request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const id = nonEmpty(url.searchParams.get('id'));
  const wantImage = url.searchParams.get('img') === '1';

  // Try to fetch the post (only if we have an id)
  let post = null;
  if (id) {
    try {
      post = await getPostFromFirestore(id);
    } catch {
      // swallow—if Firestore fails, we’ll still render a generic card/page
    }
  }

  // Text we’ll show on the image
  const rawText = nonEmpty(post?.message) || nonEmpty(url.searchParams.get('t'));

  // If the caller is a crawler (or someone hitting ?img=1), return the PNG
  if (wantImage) {
    // NOTE: you can change the domain label in the footer here
    return renderOGImage({ text: rawText, domain: 'share.anonymoustoc.com' });
  }

  // Otherwise, render the HTML landing with OG/Twitter tags that point to the image above
  const siteName = 'AnonymousToc';
  const title = 'A whisper from AnonymousToc';
  const description = 'A whisper from AnonymousToc'; // keep this short + branded
  const ogImage = `${origin}/ps?id=${encodeURIComponent(id)}&img=1`;

  // Deep link + store fallbacks
  const APP_SCHEME = process.env.APP_SCHEME || 'anonymoustoc://ps?id=';
  const IOS_STORE =
    process.env.IOS_STORE_URL || 'https://apps.apple.com/app/id6746080508';
  const AND_STORE =
    process.env.ANDROID_STORE_URL ||
    'https://play.google.com/store/apps/details?id=your.package';

  const deepLink = `${APP_SCHEME}${encodeURIComponent(id)}`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- Basic Meta -->
  <meta name="description" content="${escapeHtml(description)}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${escapeHtml(siteName)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="${origin}/ps?id=${encodeURIComponent(id)}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${ogImage}" />

  <style>
    :root { color-scheme: light dark; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      background: #0b0c0d; color: #eaeaea;
      display: grid; min-height: 100dvh; place-items: center;
    }
    .card {
      width: min(560px, 92vw); padding: 24px; border-radius: 14px;
      background: rgba(255,255,255,0.06); backdrop-filter: blur(6px);
      border: 1px solid rgba(255,255,255,0.08);
    }
    h1 { margin: 0 0 8px; font-size: 20px; }
    p { margin: 0 0 18px; opacity: .9; white-space: pre-line; }
    .row { display: flex; gap: 10px; flex-wrap: wrap; }
    .btn {
      appearance: none; border: 0; padding: 12px 16px; border-radius: 10px;
      background: #0ea5a6; color: #fff; font-weight: 600; text-decoration: none;
      display: inline-flex;
    }
    .btn.secondary { background: #2e2e2e; }
    .small { font-size: 12px; opacity: .8; margin-top: 14px; }
    .preview {
      margin: 10px 0 18px;
      border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);
      aspect-ratio: 1200 / 630; width: 100%; background: #111;
      display: grid; place-items: center;
    }
    .preview img { width: 100%; height: 100%; object-fit: cover; }
  </style>

  <script>
    (function () {
      var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      var store = /iPhone|iPad|iPod/i.test(navigator.userAgent)
        ? ${JSON.stringify(IOS_STORE)}
        : ${JSON.stringify(AND_STORE)};
      var deep = ${JSON.stringify(deepLink)};
      var hasId = ${JSON.stringify(Boolean(id))};

      if (isMobile && hasId) {
        var timer = setTimeout(function(){ location.href = store; }, 1500);
        location.href = deep;
        setTimeout(function(){ clearTimeout(timer); }, 2500);
      }
    })();
  </script>
</head>
<body>
  <div class="card">
    <h1>${escapeHtml(title)}</h1>
    <div class="preview">
      <img src="${ogImage}" alt="AnonymousToc preview" loading="eager" />
    </div>
    <p>It’s the soul that matters.</p>
    <div class="row">
      <a class="btn" href="${deepLink}">Open in App</a>
      <a class="btn secondary" href="${IOS_STORE}">iOS</a>
      <a class="btn secondary" href="${AND_STORE}">Android</a>
    </div>
    <div class="small">Shared post ID: ${escapeHtml(id || '—')}</div>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
