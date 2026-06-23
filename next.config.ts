import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // Ignore TypeScript errors during build (temporary)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;