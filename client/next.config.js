// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })
// module.exports = withBundleAnalyzer({})

const path = require('path');

module.exports = {
  ...process.env.NEXT_STANDALONE ? { output: "standalone" } :{},
  webpack: (config, { dev}) => {
    config.resolve.fallback = { http: false, https: false, net: false, tls: false };

    if (dev) {
      config.watchOptions = {
        followSymlinks: true,
      }

      config.snapshot.managedPaths = [];
    }

    // config.module.rules.push({
    //   test: /\.css$/,
    //   issuer: /\.(js|ts)x?$/,
    //   use: [
    //     'style-loader',
    //     {
    //       loader: 'css-loader',
    //       options: {
    //         importLoaders: 1,
    //       },
    //     },
    //     'postcss-loader', 
    //   ],
    //   include: [
    //     path.resolve(__dirname, 'node_modules/petercat-lui/dist'),
    //   ],
    //   exclude: [
    //     path.resolve(__dirname, './app/globals.css'),
    //   ],
    // });
    return config;
  }
};
