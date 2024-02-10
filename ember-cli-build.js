'use strict';

require('dotenv').config();

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { createEmberCLIConfig } = require('ember-cli-bundle-analyzer/create-config');
const { Webpack } = require('@embroider/webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const shouldSpawnBundleAnalyzer = process.env.ANALYZE_BUNDLE === 'true';

const fetch = require('node-fetch');
const config = require('./config/environment')(EmberApp.env());

module.exports = function (defaults) {
  const appOptions = {
    babel: {
      plugins: [
        require.resolve('ember-concurrency/async-arrow-task-transform'),
        ...require('ember-cli-code-coverage').buildBabelPlugin({ embroider: true }),
      ],
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

    prember: {
      urls: async function generatePremberUrls() {
        // Default routes to pre-generate with FastBoot
        const urls = ['/', '/catalog'];

        // Get a list of Courses and Languages from the API
        const apiResponse = await fetch(`${config.x.backendUrl}/api/v1/courses?include=language-configurations.language`);

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

        // Return the full list of routes
        return urls;
      },
    },
  };

  let app = new EmberApp(defaults, { ...appOptions, ...createEmberCLIConfig() });

  const compiledApp = require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    splitAtRoutes: ['badges', 'concept', 'code-walkthrough', 'course-admin', 'concept-admin'], // can also be a RegExp
    packagerOptions: {
      publicAssetURL: '/',
      webpackConfig: {
        plugins: [
          sentryWebpackPlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
          }),

          ...[shouldSpawnBundleAnalyzer ? [new BundleAnalyzerPlugin()] : []],
        ],
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

  return require('prember').prerender(app, compiledApp);
};
