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
    ]
  },
  images: {
    domains: ['api.realworld.io'],
  }
}
