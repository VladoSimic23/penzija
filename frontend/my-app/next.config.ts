import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/na-današnji-dan",
        destination: "/na-danasnji-dan",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [65, 68, 70, 72, 75],
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
