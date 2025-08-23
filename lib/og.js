// /lib/og.js
export function buildOgFromPost(post) {
  const title =
    (post?.title || post?.caption || "A whisper from AnonymousToc").slice(0, 80);
  const description =
    (post?.message || post?.caption || "It’s the soul that matters.").slice(0, 200);

  const host = process.env.VERCEL_URL || "anonymoustoc-share-meta.vercel.app";
  const imageUrl = `https://${host}/og-default.png`;

  return { title, description, imageUrl };
}
