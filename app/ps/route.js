<<<<<<< HEAD
// app/ps/route.js
import { getPostFromFirestore } from "../../lib/firestore.js";

/** Helpers */
function sanitize(str = "") {
  return String(str).replace(/\s+/g, " ").trim();
}
function truncate(str = "", max = 180) {
  const s = sanitize(str);
  return s.length <= max ? s : s.slice(0, max - 1).trimEnd() + "…";
}
function absoluteBase(request) {
  const host = request.headers.get("host") || process.env.VERCEL_URL;
  return `https://${host}`;
}

export async function GET(request) {
  const url = new URL(request.url);
  const postId = url.searchParams.get("id") || "";
  const base = absoluteBase(request);
  const selfUrl = `${base}/ps?id=${encodeURIComponent(postId)}`;
  const ogImage = `${base}/og-default.png`;

  // Default meta (in case id is missing or doc not found)
  let title = "A Whisper from AnonymousToc";
  let description = "It’s the soul that matters.";
  let caption = "";

  if (postId) {
    try {
      const doc = await getPostFromFirestore(postId);
      if (doc) {
        // try common field names you use (adjust as needed)
        caption = doc.message || doc.caption || doc.text || "";
        description = truncate(caption || description, 180);
      }
    } catch (err) {
      // keep defaults on error
      console.error("OG fetch error:", err.message || err);
    }
  }

  // Build minimal HTML with rich meta tags
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="description" content="${description}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="AnonymousToc" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${selfUrl}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage}" />

  <!-- Optional: app links (won’t affect cards but good to have) -->
  <meta property="al:ios:app_name" content="AnonymousToc" />
  <meta property="al:android:app_name" content="AnonymousToc" />
</head>
<body style="font-family:system-ui,-apple-system,Segoe UI,Roboto; padding:2rem;">
  <h1 style="margin:0 0 .5rem 0;">${title}</h1>
  <p style="max-width:50ch; line-height:1.5;">${caption || description}</p>

  <div style="margin-top:1.5rem;">
    <a href="${selfUrl}" style="display:inline-block;padding:.75rem 1rem;background:#0f766e;color:#fff;border-radius:.5rem;text-decoration:none;">
      Open this whisper
    </a>
  </div>

  <!-- (No auto-redirect to keep scrapers happy and ensure rich preview) -->
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}



=======
// app/ps/route.js
import { getPostFromFirestore } from "../../lib/firestore.js";

/** Helpers */
function sanitize(str = "") {
  return String(str).replace(/\s+/g, " ").trim();
}
function truncate(str = "", max = 180) {
  const s = sanitize(str);
  return s.length <= max ? s : s.slice(0, max - 1).trimEnd() + "…";
}
function absoluteBase(request) {
  const host = request.headers.get("host") || process.env.VERCEL_URL;
  return `https://${host}`;
}

export async function GET(request) {
  const url = new URL(request.url);
  const postId = url.searchParams.get("id") || "";
  const base = absoluteBase(request);
  const selfUrl = `${base}/ps?id=${encodeURIComponent(postId)}`;
  const ogImage = `${base}/og-default.png`;

  // Default meta (in case id is missing or doc not found)
  let title = "A Whisper from AnonymousToc";
  let description = "It’s the soul that matters.";
  let caption = "";

  if (postId) {
    try {
      const doc = await getPostFromFirestore(postId);
      if (doc) {
        // try common field names you use (adjust as needed)
        caption = doc.message || doc.caption || doc.text || "";
        description = truncate(caption || description, 180);
      }
    } catch (err) {
      // keep defaults on error
      console.error("OG fetch error:", err.message || err);
    }
  }

  // Build minimal HTML with rich meta tags
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="description" content="${description}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="AnonymousToc" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${selfUrl}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage}" />

  <!-- Optional: app links (won’t affect cards but good to have) -->
  <meta property="al:ios:app_name" content="AnonymousToc" />
  <meta property="al:android:app_name" content="AnonymousToc" />
</head>
<body style="font-family:system-ui,-apple-system,Segoe UI,Roboto; padding:2rem;">
  <h1 style="margin:0 0 .5rem 0;">${title}</h1>
  <p style="max-width:50ch; line-height:1.5;">${caption || description}</p>

  <div style="margin-top:1.5rem;">
    <a href="${selfUrl}" style="display:inline-block;padding:.75rem 1rem;background:#0f766e;color:#fff;border-radius:.5rem;text-decoration:none;">
      Open this whisper
    </a>
  </div>

  <!-- (No auto-redirect to keep scrapers happy and ensure rich preview) -->
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}



>>>>>>> e272959 (Add/Update share-meta files locally)
