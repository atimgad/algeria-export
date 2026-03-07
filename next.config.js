/** @type {import('next').NextConfig} */
const nextConfig = {
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