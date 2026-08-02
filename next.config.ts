import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath: isGithubPages ? "/SBTI" : undefined,
  assetPrefix: isGithubPages ? "/SBTI/" : undefined,
  trailingSlash: isGithubPages,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
