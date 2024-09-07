// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })
// module.exports = withBundleAnalyzer({})
const { withSentryConfig } = require("@sentry/nextjs");


const nextConfig = {
  ...process.env.NEXT_STANDALONE ? { output: "standalone" } :{},
  webpack: (config, { dev}) => {
    config.resolve.fallback = { http: false, https: false, net: false, tls: false };

    if (dev) {
      config.watchOptions = {
        followSymlinks: true,
      }

      config.snapshot.managedPaths = [];
    }
    return config;
  }
};

// Make sure adding Sentry options is the last code to run before exporting
module.exports = withSentryConfig(nextConfig, {
  org: "petercat",
  project: "petercat",

  // An auth token is required for uploading source maps.
  authToken: process.env.SENTRY_AUTH_TOKEN,

  silent: false, // Can be used to suppress logs

  hideSourceMaps: true,
  
  sourcemaps: {
    disable: true,
  },
});