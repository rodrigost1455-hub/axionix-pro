/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@axionix/ui", "@axionix/core", "@axionix/services"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "oaidalleapiprodscus.blob.core.windows.net" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.googleapis.com" },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["bcryptjs", "@prisma/client", "prisma"],
  },
};

module.exports = nextConfig;
