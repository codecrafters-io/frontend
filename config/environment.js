'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'codecrafters-frontend',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    serverVariables: {
      tagPrefix: 'codecrafters',
      vars: ['server-url', 'current-user-payload'],
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.serverVariables.defaults = {
      'server-url': 'https://codecrafters.ngrok.io',
      'current-user-payload': JSON.stringify({
        type: 'users',
        id: '63c51e91-e448-4ea9-821b-a80415f266d3',
        attributes: {
          'avatar-url': 'https://github.com/rohitpaulk.png',
          'created-at': '2021-08-29T16:50:12.551986+00:00',
          'github-username': 'rohitpaulk',
          username: 'rohitpaulk',
        },
      }),
    };
  }

  ENV['@sentry/ember'] = {
    sentry: {
      autoSessionTracking: true,
      dsn: '',
      tracesSampleRate: 1.0,
    },
  };

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV['@sentry/ember'].sentry.dsn =
      'https://478cca7283ca40209deae5160b54ee4f@o294739.ingest.sentry.io/5922961';
  }

  return ENV;
};
