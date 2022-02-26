import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = 'api/v1';
  @service serverVariables;
  @service currentUser;

  get headers() {
    const headers = {};

    if (window.FS && window.FS.getCurrentSessionURL && window.FS.getCurrentSessionURL()) {
      headers['x-fullstory-session-url'] = window.FS.getCurrentSessionURL();
    }

    return headers;
  }

  get host() {
    return this.serverVariables.get('serverUrl');
  }
}
