let proxy = require('next/dist/compiled/http-proxy')
function Proxy(options) {
  console.log('PROXY STUB')
  options = options || {}
  options.secure = false

  return new proxy(options)
}

// @ts-nocheck
proxy.exports = Proxy

module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/search',
        permanent: true,
      },
    ]
  },
  images: {
    domains: ['i.scdn.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/image/**',
      },
    ],
  },
  reactStrictMode: true,
    async headers() {
      return [
      {
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "http://localhost:3000" },
        { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
        ]
      }]
  },
  api: {
    responseLimit: '100mb',
    // responseLimit: '8mb',
  }
}
