'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { createEmberCLIConfig } = require('ember-cli-bundle-analyzer/create-config');
const { Webpack } = require('@embroider/webpack');

// const _isProduction = EmberApp.env() === 'production';
const cdnBaseURL = process.env.CDN_BASE_URL;
const shouldUseCDN = !!cdnBaseURL;

module.exports = function (defaults) {
  const appOptions = {
    babel: {
      plugins: [...require('ember-cli-code-coverage').buildBabelPlugin()],
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
    };
  }

  let app = new EmberApp(defaults, { ...appOptions, ...createEmberCLIConfig() });

  return require('@embroider/compat').compatBuild(app, Webpack, {
    // staticAddonTestSupportTrees: true,
    // staticAddonTrees: true,
    // staticHelpers: true,
    // staticModifiers: true,
    // staticComponents: true,
    // splitAtRoutes: ['route.name'], // can also be a RegExp
    // packagerOptions: {
    //    webpackConfig: { }
    // }
  });
};
