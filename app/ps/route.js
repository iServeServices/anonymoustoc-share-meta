// /app/ps/route.js
import { NextResponse } from "next/server";
import { getPostFromFirestore } from '../../lib/firestore.js';
import { buildOgFromPost } from "../../lib/og.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // If no id, return minimal page
  if (!id) {
    return new NextResponse("<!doctype html><html><head><title>AnonymousToc</title></head><body>Missing id</body></html>", {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const base = 'https://share.anonymoustoc.com'; // your Vercel/custom domain
  const ogImage = `${base}/api/og-image?id=${encodeURIComponent(id)}`;
  
  const html = `<!doctype html>
  <html lang="en">
  <head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="AnonymousToc" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="${ogImage}" />
  ...
  </head>
  <body> ... </body>
  </html>`;


  return new NextResponse(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(s = "") {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}



