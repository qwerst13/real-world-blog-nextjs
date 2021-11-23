/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/articles',
        destination: '/',
        permanent: true,
      },
      {
        source: '/articles/1',
        destination: '/',
        permanent: true,
      },
      {
        source: '/article',
        destination: '/',
        permanent: true,
      }
    ]
  },
  images: {
    domains: [],
  }
}
