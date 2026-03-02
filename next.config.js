/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignorer les erreurs TypeScript pendant le build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignorer les erreurs ESLint pendant le build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;