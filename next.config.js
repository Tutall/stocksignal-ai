/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '',
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://stocksignalai.com' : '',
  trailingSlash: true,
};

module.exports = nextConfig;
