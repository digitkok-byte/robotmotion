import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["http://192.168.1.79:3000"],
};

export default nextConfig;
