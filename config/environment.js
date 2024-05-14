'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'codecrafters-frontend',
    environment,
    rootURL: '/',
    locationType: 'history',

    EmberENV: {
      EXTEND_PROTOTYPES: true, // Haven't migrated yet
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    '@sentry/ember': {
      disablePerformance: true, // Temporary, https://github.com/getsentry/sentry-javascript/issues/10566
      disableInstrumentComponents: true,
    },

    x: {
      backendUrl: process.env.BACKEND_URL || 'https://test-backend.ngrok.io',

      defaultMetaTags: {
        type: 'website',
        siteName: 'CodeCrafters',
        title: "The Software Pro's Best Kept Secret.",
        description: [
          'Real-world proficiency projects designed for experienced engineers.',
          'Develop software craftsmanship by recreating popular devtools from scratch.',
        ].join(' '),
        imageUrl: 'https://codecrafters.io/images/og-index.jpg',
        twitterCard: 'summary_large_image',
        twitterSite: '@codecraftersio',
      },

      metaTagImagesBaseURL: 'https://codecrafters.io/images/app_og/',
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      vercelAnalyticsId: process.env.VERCEL_ANALYTICS_ID,

      // Update the major version number to force all clients to update.
      // The minor version doesn't do anything at the moment, might use in the future.
      version: `12.0.${process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev'}`,
    },
    fastboot: {
      hostWhitelist: [/^localhost:\d+$/],
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    // To run against mirage
    // ENV.x.backendUrl = 'http://localhost:4200';
    // ENV['ember-cli-mirage'] = { enabled: true };

    // To run against development server
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

    ENV.x.percyIsEnabled = process.env.PERCY_ENABLE === 'true';
  }

  return ENV;
};
