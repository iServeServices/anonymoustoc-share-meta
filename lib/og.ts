export function truncate(s: string, n: number) {
  const t = (s || '').trim();
  return t.length <= n ? t : t.slice(0, n - 1).trimEnd() + '…';
}

// Static branded OG image now (already uploaded to Wix or any CDN)
export function buildOgImageUrl(_: string) {
  return 'https://firebasestorage.googleapis.com/v0/b/anonymous-toc-tdhegh.firebasestorage.app/o/images%2FWhatsApp%20Image%202025-08-23%20at%2000.12.09_5da45e5a.jpg?alt=media&token=449d9416-4420-40d2-8b88-af8659b26d6d'; // TODO: place your uploaded image URL here
}
