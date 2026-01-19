import config from 'codecrafters-frontend/config/environment';
import { createServer } from 'miragejs';
import { pluralize, singularize } from 'ember-inflector';
import factories from './factories';
import models from './models';
import serializers from './serializers';
import scenarios from './scenarios';
import handlers from './handlers';

export default function (options) {
  let finalConfig = {
    ...options,
    environment: config.environment,
    models,
    factories,
    serializers,
    scenarios,
    inflector: {
      pluralize,
      singularize,
    },
    routes,
    trackRequests: config.environment === 'test',
  };

  return createServer(finalConfig);
}

function routes() {
  this.passthrough('/write-coverage'); // used by ember-cli-code-coverage
  this.passthrough('/assets/**'); // 3d models?
  this.passthrough('https://beacon-v2.helpscout.net/**'); // HelpScout Beacon
  this.passthrough('https://d3hb14vkzrxvla.cloudfront.net/**'); // HelpScout Beacon
  this.passthrough('https://unpkg.com/**'); // Shiki
  this.passthrough('https://cdn.jsdelivr.net/**'); // Rive App
  this.passthrough('/version.txt');
  this.passthrough('https://codecrafters.io/images/**');

  this.urlPrefix = config.x.backendUrl;
  this.namespace = '/api/v1';
  // this.timing = 1000;

  this.pretender.prepareHeaders = function (headers) {
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';

    return headers;
  };

  window.server = this; // Hack! Is there a better way?

  handlers(this); // Run all the handlers
}
