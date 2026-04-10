/** @type {import('next').NextConfig} */
// GitHub Pages 배포시에만 basePath를 사용한다.
const repositoryName =
  process.env.GITHUB_REPOSITORY_NAME ||
  process.env.NEXT_PUBLIC_BASE_PATH ||
  "Dodamdodam-Koreanisch-Schule";
const isGitHubPages =
  process.env.GITHUB_ACTIONS === "true" ||
  process.env.DEPLOY_TARGET === "github-pages";
const basePath = isGitHubPages ? `/${repositoryName}` : "";

const nextConfig = {
  output: "export",
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true, // GitHub Pages는 이미지 최적화를 지원하지 않음
  },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

module.exports = nextConfig
