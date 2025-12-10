/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@admin-platform/shared-types",
    "@admin-platform/shared-utils",
    "@admin-platform/shared-auth",
  ],
  output: "standalone",
};

module.exports = nextConfig;
