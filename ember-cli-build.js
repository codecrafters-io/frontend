'use strict';

require('dotenv').config({ quiet: true });

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const config = require('./config/environment')(EmberApp.env());
const customFilePlugin = require('./lib/custom-file-plugin');
const nodeFetch = require('node-fetch');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { Webpack } = require('@embroider/webpack');
const { codecovWebpackPlugin } = require('@codecov/webpack-plugin');
const { createEmberCLIConfig } = require('ember-cli-bundle-analyzer/create-config');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

const shouldSpawnBundleAnalyzer = process.env.ANALYZE_BUNDLE === 'true';
const shouldUploadSentrySourcemaps = !!process.env.CI && !process.env.VERCEL;

module.exports = function (defaults) {
  const appOptions = {
    babel: {
      plugins: [
        require.resolve('ember-concurrency/async-arrow-task-transform'),
        ...require('ember-cli-code-coverage').buildBabelPlugin({ embroider: true }),
      ],
    },

    emberData: {
      deprecations: {
        DEPRECATE_STORE_EXTENDS_EMBER_OBJECT: false, // Remove this after migrating off array prototype extensions usages
      },
    },

    '@embroider/macros': {
      setConfig: {
        '@ember-data/store': {
          polyfillUUID: true,
        },
      },
    },

    'ember-cli-babel': { enableTypeScriptTransform: true },

    sourcemaps: { enabled: true },

    svgJar: {
      sourceDirs: ['public/assets/images/heroicons/outline', 'public/assets/images/heroicons/solid', 'public/assets/images/svg-icons'],
    },

    prember: {
      urls: async function generatePremberUrls() {
        // Default routes to pre-generate with FastBoot
        const urls = [
          '/',
          '/catalog',
          '/concepts/test-concept-for-ci',
          '/contests/weekly-7', // TODO: Render the currently active contest instead of hardcoding weekly-7
          '/users/codecrafters-bot',
        ];

        // Get a list of Courses and Languages from the API
        const apiResponse = await nodeFetch(`${config.x.backendUrl}/api/v1/courses?include=language-configurations.language`);

        if (apiResponse.status !== 200) {
          throw new Error(`Failed to load Courses and Languages from the API, status: ${apiResponse.status}`);
        }

        // Parse the response and make a combined list of all models
        const payload = await apiResponse.json();
        const models = [...(payload.data || []), ...(payload.included || [])];

        // Add routes for all Courses
        urls.push(...models.filter(({ type }) => type === 'courses').map(({ attributes: { slug } }) => `/courses/${slug}/overview`));

        // Add routes for all Languages
        urls.push(...models.filter(({ type }) => type === 'languages').map(({ attributes: { slug } }) => `/tracks/${slug}`));

        urls.push('/collections/rust-primer'); // will update if we get more collections

        // Get institutions from the API
        const institutionsResponse = await nodeFetch(`${config.x.backendUrl}/api/v1/institutions`);

        if (institutionsResponse.status !== 200) {
          throw new Error(`Failed to load Institutions from the API, status: ${institutionsResponse.status}`);
        }

        const institutionsPayload = await institutionsResponse.json();

        urls.push(...(institutionsPayload.data || []).map(({ attributes: { slug } }) => `/campus/${slug}`));

        // Return the full list of routes
        return urls;
      },
    },
  };

  let app = new EmberApp(defaults, { ...appOptions, ...createEmberCLIConfig() });

  const compiledApp = require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticAppPaths: ['mirage'],
    staticEmberSource: true,
    staticInvokables: true,
    splitAtRoutes: ['badges', 'concept', 'code-walkthrough', 'course', 'course-admin', 'concept-admin', 'demo'], // can also be a RegExp
    packagerOptions: {
      publicAssetURL: '/',
      webpackConfig: {
        optimization:
          config.environment !== 'test'
            ? undefined // Use default optimization settings in production and development environments
            : {
                // In testing environments, squash together chunks from libraries with a lot of chunks, to fix occasional
                // chunk loading errors when running tests in concurrent browser instances spawned by ember-exam.
                splitChunks: {
                  cacheGroups: {
                    codemirror: {
                      test: /[\\/]node_modules[\\/][@]?(codemirror|lezer)/,
                      name: 'codemirror',
                      chunks: 'all',
                      idHint: 'codemirror',
                    },
                    shiki: {
                      test: /[\\/]node_modules[\\/][@]?(shiki)/,
                      name: 'shiki',
                      chunks: 'all',
                      idHint: 'shiki',
                    },
                  },
                },
              },
        plugins: [
          customFilePlugin('version.txt', config.x.version),

          codecovWebpackPlugin({
            enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
            bundleName: 'client',
            uploadToken: process.env.CODECOV_TOKEN,
          }),

          shouldUploadSentrySourcemaps
            ? sentryWebpackPlugin({
                org: 'codecrafters',
                project: 'frontend',
                authToken: process.env.SENTRY_AUTH_TOKEN,
                release: {
                  name: config.x.version,
                },
              })
            : null,

          shouldSpawnBundleAnalyzer ? new BundleAnalyzerPlugin() : null,
        ],
        devtool: EmberApp.env() === 'development' ? 'eval-source-map' : 'source-map',
        module: {
          rules: [
            {
              test: /\.css$/i,
              use: ['postcss-loader'],
            },
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

  return require('prember').prerender(app, compiledApp);
};
