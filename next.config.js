/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uoaafekflbksvkzulclt.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig