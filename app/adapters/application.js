import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
import config from 'codecrafters-frontend/config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = 'api/v1';
  @service currentUser;

  get headers() {
    const headers = {};

    // TODO: Add session ID header?
    return headers;
  }

  get host() {
    return config.x.backendUrl;
  }
}
