'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { createEmberCLIConfig } = require('ember-cli-bundle-analyzer/create-config');
const { Webpack } = require('@embroider/webpack');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// const _isProduction = EmberApp.env() === 'production';
const cdnBaseURL = process.env.CDN_BASE_URL;
const shouldUseCDN = !!cdnBaseURL;

module.exports = function (defaults) {
  const appOptions = {
    babel: {
      plugins: [...require('ember-cli-code-coverage').buildBabelPlugin({ embroider: true })],
    },

    emberCLIDeploy: {
      // Change development -> production & use "ember serve --prod" to test purgecss
      runOnPostBuild: EmberApp.env() === 'development' ? 'development-postbuild' : false,
      configFile: 'config/deploy.js',
      shouldActivate: true,
    },

    '@embroider/macros': {
      setConfig: {
        '@ember-data/store': {
          polyfillUUID: true,
        },
      },
    },

    sourcemaps: { enabled: true },

    svgJar: {
      sourceDirs: ['public/assets/images/heroicons/outline', 'public/assets/images/heroicons/solid', 'public/assets/images/svg-icons'],
    },
  };

  if (shouldUseCDN) {
    appOptions.fingerprint = {
      extensions: ['js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'map', 'svg', 'ico'],
      prepend: cdnBaseURL,
    };

    appOptions.autoImport = {
      publicAssetURL: `${cdnBaseURL}assets`,
    };
  }

  let app = new EmberApp(defaults, { ...appOptions, ...createEmberCLIConfig() });

  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    splitAtRoutes: ['badges'], // can also be a RegExp
    packagerOptions: {
      publicAssetURL: shouldUseCDN ? cdnBaseURL : '/',
      webpackConfig: {
        // plugins: EmberApp.env() === 'development' ? [new BundleAnalyzerPlugin()] : [],
        plugins: [],
        devtool: shouldUseCDN ? 'source-map' : 'eval-source-map',
        module: {
          rules: [
            {
              test: /tailwind\.css$/i,
              use: [
                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: {
                      config: 'postcss.config.js',
                    },
                  },
                },
              ],
            },
            {
              test: /\.(css|glb|png|jpg|jpeg|gif|svg|ico)$/,
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
