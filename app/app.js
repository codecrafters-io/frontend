import Application from '@ember/application';
import compatModules from '@embroider/virtual/compat-modules';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import * as Sentry from '@sentry/ember';
import 'ember-basic-dropdown/styles';
import 'ember-animated/index';
import '@typeform/embed/build/css/popup.css';
import './tailwind.css';

const sentryDSN = 'https://478cca7283ca40209deae5160b54ee4f@o294739.ingest.sentry.io/5922961';

if (config.environment === 'development' || config.environment === 'production') {
  Sentry.init({
    autoSessionTracking: true,
    dsn: config.environment === 'production' ? sentryDSN : '',
    environment: config.environment,
    ignoreErrors: ['TypeError: Failed to fetch'],
    release: config.x.version,
    tracesSampleRate: 0.01,
  });
}

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
}

loadInitializers(App, config.modulePrefix, compatModules);
