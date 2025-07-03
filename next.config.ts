import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // Crucial for the production Docker image
};

export default nextConfig;
