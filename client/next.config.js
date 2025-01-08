const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  ...process.env.NEXT_STANDALONE ? { output: "standalone" } : {}, // Standalone configuration
  webpack: (config, { dev }) => {
    config.resolve.fallback = { http: false, https: false, net: false, tls: false };

    if (dev) {
      config.watchOptions = {
        followSymlinks: true,
      };

      config.snapshot.managedPaths = [];
    }

    // Add markdown loader
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });

    return config;
  },
};


const sentryOptions = {
  org: "petercat",
  project: "petercat",
  authToken: process.env.SENTRY_AUTH_TOKEN, 
  silent: false, 
  hideSourceMaps: true,
  sourcemaps: {
    disable: true,
  },
};

module.exports = withSentryConfig(nextConfig, sentryOptions);
