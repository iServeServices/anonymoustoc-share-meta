// /app/ps/route.js
import { NextResponse } from "next/server";
import { getPostFromFirestore } from './_firestore.js';
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

  const post = await getPostFromFirestore(id).catch(() => null);
  const { title, description, imageUrl } = buildOgFromPost(post);

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>

    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="AnonymousToc" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${imageUrl}" />

    <meta http-equiv="refresh" content="0; url=https://www.anonymoustoc.com/ps?id=${encodeURIComponent(id)}" />
  </head>
  <body>Redirecting…</body>
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

