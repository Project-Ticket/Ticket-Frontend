import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 100000,
  trailingSlash: false,
  reactStrictMode: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },

  images: {
    domains: [
      "ui-avatars.com",
      "images.pexels.com",
      "10.255.10.219",
      "10.255.10.154",
      "localhost",
    ],
  },

  async rewrites() {
    let rewrites = [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_LINK}:path*`,
      },
      {
        source: "/storage/:path*",
        destination: `${process.env.NEXT_PUBLIC_STORAGE_LINK}:path*`,
      },
    ];

    return rewrites;
  },
};

export default nextConfig;
