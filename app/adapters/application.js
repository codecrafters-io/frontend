import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
import config from 'codecrafters-frontend/config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = 'api/v1';
  @service sessionTokenStorage;

  get headers() {
    const headers = {};

    if (this.sessionTokenStorage.hasToken) {
      headers['X-Session-Token'] = this.sessionTokenStorage.currentToken;
    }

    return headers;
  }

  get host() {
    return config.x.backendUrl;
  }
}
