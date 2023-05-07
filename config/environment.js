'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'codecrafters-frontend',
    environment,
    moment: {
      outputFormat: 'L',
    },
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    segment: {
      enabled: environment === 'production',
      WRITE_KEY: 'HnKMbAj1U5apx9o6R0Xkp14vofTp2LEf',
    },

    serverVariables: {
      tagPrefix: 'codecrafters',
      vars: ['csrf-token', 'server-url', 'current-user-payload', 'stripe-publishable-key'],
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.serverVariables.defaults = {};

    ENV.serverVariables.defaults['server-url'] = 'https://localhost:4200';
    ENV['ember-cli-mirage'] = { enabled: true };

    // To run against development server
    ENV.serverVariables.defaults['server-url'] = 'https://codecrafters.ngrok.io';
    ENV['ember-cli-mirage'] = { enabled: false };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    ENV['ember-cli-mirage'] = {
      trackRequests: true,
    };
  }

  return ENV;
};
