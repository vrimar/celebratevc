/** @type {import('next').NextConfig} */

// Set this to your repo name when deploying to GitHub Pages at username.github.io/repo-name
// Leave as '' if deploying to a custom domain or to username.github.io (root)
const repoName = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: repoName,
  assetPrefix: repoName ? `${repoName}/` : '',
  reactStrictMode: true,
};

module.exports = nextConfig;
