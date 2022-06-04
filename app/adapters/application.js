import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = 'api/v1';
  @service serverVariables;
  @service currentUser;

  get headers() {
    const headers = {};

    if (this.serverVariables.get('csrfToken')) {
      headers['X-CSRF-Token'] = this.serverVariables.get('csrfToken');
    }

    return headers;
  }

  get host() {
    return this.serverVariables.get('serverUrl');
  }
}
