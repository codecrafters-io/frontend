import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'codecrafters-frontend/config/environment';
import * as Sentry from '@sentry/ember';

const sentryDSN = 'https://478cca7283ca40209deae5160b54ee4f@o294739.ingest.sentry.io/5922961';

if (config.environment === 'development' || config.environment === 'production') {
  Sentry.init({
    autoSessionTracking: true,
    dsn: config.environment === 'production' ? sentryDSN : '',
    environment: config.environment,
    release: config.x.version,
    tracesSampleRate: 0.01,
  });
}

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
