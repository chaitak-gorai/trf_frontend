/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['pbs.twimg.com', 'abs.twimg.com', 'www.google.com'],
  },
}

module.exports = nextConfig
