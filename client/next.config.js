// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })
// module.exports = withBundleAnalyzer({})

module.exports = {
  ...process.env.NEXT_STANDALONE ? { output: "standalone" } :{},
  webpack: (config) => {
    config.resolve.fallback = { http: false, https: false, net: false, tls: false };

    return config;
  }
};
