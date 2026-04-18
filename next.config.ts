import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: "C:/Users/Denise/Desktop/chat-app",
  },
};

export default nextConfig;