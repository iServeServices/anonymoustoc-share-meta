// app/ps/route.js
export const dynamic = 'force-dynamic';

import { getPostFromFirestore } from '../../lib/firestore.js';

const truncate = (t = '', n = 220) =>
  t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t;

const escapeHtml = (s = '') =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export async function GET(request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const id = url.searchParams.get('id') || '';

  let post = null;
  try {
    if (id) post = await getPostFromFirestore(id);
  } catch (_) {}

  const siteName = 'AnonymousToc';
  const title = 'A whisper from AnonymousToc';
  const rawText = (post?.message || '').toString().trim();
  const description = truncate(rawText || 'It’s the soul that matters.', 220);

  // ⬇⬇⬇ Point og:image to the dynamic card we just added
  const ogImage = `${origin}/ps/card?t=${encodeURIComponent(description)}`;

  const APP_SCHEME = process.env.APP_SCHEME || 'anonymoustoc://ps?id=';
  const IOS_STORE =
    process.env.IOS_STORE_URL ||
    'https://apps.apple.com/app/id6746080508'; // TODO set real link
  const AND_STORE =
    process.env.ANDROID_STORE_URL ||
    'https://play.google.com/store/apps/details?id=your.package'; // TODO set real link

  const deepLink = `${APP_SCHEME}${encodeURIComponent(id)}`;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    
        // inside the <head> response you build for OG/Twitter
    <title>A whisper from AnonymousToc</title>
    <meta name="description" content="It’s the soul that matters." />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="AnonymousToc" />
    <meta property="og:title" content="A whisper from AnonymousToc" />
    <meta property="og:description" content="A whisper from AnonymousToc" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${origin}/ps?id=${encodeURIComponent(id)}" />


    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${ogImage}" />

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: light dark; }
      body {
        margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
        background: #0b0c0d; color: #eaeaea;
        display: grid; min-height: 100dvh; place-items: center;
      }
      .card { width: min(560px, 92vw); padding: 24px; border-radius: 14px;
        background: rgba(255,255,255,0.06); backdrop-filter: blur(6px);
        border: 1px solid rgba(255,255,255,0.08);
      }
      h1 { margin: 0 0 8px; font-size: 20px; }
      p { margin: 0 0 18px; opacity: .9; white-space: pre-line; }
      .row { display: flex; gap: 10px; flex-wrap: wrap; }
      .btn { appearance: none; border: 0; padding: 12px 16px; border-radius: 10px;
        background: #0ea5a6; color: #fff; font-weight: 600; text-decoration: none; display: inline-flex; }
      .btn.secondary { background: #2e2e2e; }
      .small { font-size: 12px; opacity: .8; margin-top: 14px; }
    </style>

    <script>
      (function () {
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        var store = /iPhone|iPad|iPod/i.test(navigator.userAgent)
          ? ${JSON.stringify(IOS_STORE)}
          : ${JSON.stringify(AND_STORE)};
        var deep = ${JSON.stringify(deepLink)};
        if (isMobile && ${JSON.stringify(Boolean(id))}) {
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
      <p>${escapeHtml(description)}</p>
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

