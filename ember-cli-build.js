'use strict';

require('dotenv').config();

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { createEmberCLIConfig } = require('ember-cli-bundle-analyzer/create-config');
const { Webpack } = require('@embroider/webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const shouldSpawnBundleAnalyzer = process.env.ANALYZE_BUNDLE === 'true';

// const _isProduction = EmberApp.env() === 'production';

module.exports = function (defaults) {
  const appOptions = {
    babel: {
      plugins: [...require('ember-cli-code-coverage').buildBabelPlugin({ embroider: true })],
    },

    '@embroider/macros': {
      setConfig: {
        '@ember-data/store': {
          polyfillUUID: true,
        },
      },
    },

    postcssOptions: {
      compile: {
        plugins: [
          {
            module: require('postcss-import'),
            options: {
              path: ['node_modules'],
            },
          },
        ],
      },
    },

    sourcemaps: { enabled: true },

    svgJar: {
      sourceDirs: ['public/assets/images/heroicons/outline', 'public/assets/images/heroicons/solid', 'public/assets/images/svg-icons'],
    },
  };

  let app = new EmberApp(defaults, { ...appOptions, ...createEmberCLIConfig() });

  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    splitAtRoutes: ['badges', 'concept'], // can also be a RegExp
    packagerOptions: {
      publicAssetURL: '/',
      webpackConfig: {
        plugins: shouldSpawnBundleAnalyzer ? [new BundleAnalyzerPlugin()] : [],
        devtool: EmberApp.env() === 'development' ? 'eval-source-map' : 'source-map',
        module: {
          rules: [
            {
              test: /\.(glb|css|png|jpg|jpeg|gif|svg|ico|lottie\.json)$/,
              type: 'asset/resource',
              generator: {
                filename: 'assets/[hash][ext][query]',
              },
            },
          ],
        },
      },
    },
  });
};
