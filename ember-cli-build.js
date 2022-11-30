'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
// const _isProduction = EmberApp.env() === 'production';
const cdnBaseURL = process.env.CDN_BASE_URL;
const shouldUseCDN = !!cdnBaseURL;

module.exports = function (defaults) {
  const appOptions = {
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
    };
  }

  let app = new EmberApp(defaults, appOptions);

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
