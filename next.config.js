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
        source: '/1',
        destination: '/',
        permanent: true,
      }
    ]
  },
  images: {
    domains: [],
  }
}
