// /lib/og.js
export function buildOgFromPost(post) {
  const title =
    (post?.title || post?.caption || "A whisper from AnonymousToc").slice(0, 80);
  const description =
    (post?.message || post?.caption || "It’s the soul that matters.").slice(0, 200);

  // Use a static fallback image for now
  const imageUrl = `https://${process.env.VERCEL_URL || "anonymoustoc-share-meta.vercel.app"}/og-default.png`;

  return { title, description, imageUrl };
}

