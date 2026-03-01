import type { NextConfig } from "next";

const apiBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

const nextConfig: NextConfig = {
  // Ensure @react-three packages are transpiled — prevents ESM-in-CJS issues
  // in production that can cause 3D assets to silently fail to load.
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  compress: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiBase}/api/v1/:path*`,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
