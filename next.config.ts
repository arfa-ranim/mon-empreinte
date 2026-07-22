import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "*.public.blob.vercel-storage.com",
      port: "",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "*.blob.vercel-storage.com",
      port: "",
      pathname: "/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      port: "3000",
      pathname: "/**",
    },
  ],
},

};

export default nextConfig;