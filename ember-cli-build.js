'use strict';

require('dotenv').config({ quiet: true });

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');

module.exports = async function (defaults) {
  const { buildOnce } = await import('@embroider/vite');

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
  };

  let app = new EmberApp(defaults, appOptions);

  return compatBuild(app, buildOnce, {
    staticInvokables: true,
    splitAtRoutes: ['badges', 'concept', 'code-walkthrough', 'course', 'course-admin', 'concept-admin', 'demo'], // can also be a RegExp
    useAddonConfigModule: false,
    useAddonAppBoot: false,
  });
};
