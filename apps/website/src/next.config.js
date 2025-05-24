/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // สำหรับ App Router
  },
  pageExtensions: ['tsx', 'ts'],
};

module.exports = nextConfig;
