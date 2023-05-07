'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { createEmberCLIConfig } = require('ember-cli-bundle-analyzer/create-config');

const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');

// const _isProduction = EmberApp.env() === 'production';
const cdnBaseURL = process.env.CDN_BASE_URL;
const shouldUseCDN = !!cdnBaseURL;

module.exports = function (defaults) {
  const appOptions = {
    babel: {
      plugins: [...require('ember-cli-code-coverage').buildBabelPlugin()],
    },

    emberCLIDeploy: {
      runOnPostBuild: EmberApp.env() === 'development' ? 'development-postbuild' : false,
      configFile: 'config/deploy.js',
      shouldActivate: true,
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
          require('tailwindcss')('./app/tailwind.config.js'),
        ],
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
      webpack: {
        plugins: [
          new MomentLocalesPlugin({
            // 'en' is built into moment and cannot be removed. This strips the others.
            localesToKeep: [],
          }),

          new MomentTimezoneDataPlugin({
            // Keep timezone data for the US, covering all possible years.
            matchCountries: 'US',
          }),
        ],
      },
    };
  }

  const app = new EmberApp(defaults, { ...appOptions, ...createEmberCLIConfig() });

  const { Webpack } = require('@embroider/webpack');

  return require('@embroider/compat').compatBuild(app, Webpack, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    packagerOptions: {
      webpackConfig: {
        module: {
          rules: [
            {
              test: /\.css$/i,
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
          ],
        },
      },
    },
  });
};
