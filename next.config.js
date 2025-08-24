// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // no deprecated experimental.appDir here
  images: { unoptimized: true }, // safe default; remove if you don't need
};

module.exports = nextConfig;
