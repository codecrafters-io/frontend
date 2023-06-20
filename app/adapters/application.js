import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = 'api/v1';
  @service currentUser;

  get headers() {
    const headers = {};

    // TODO: Add session ID header?
    return headers;
  }

  get host() {
    // TODO: Fetch this from env?
    return 'https://cc-paul-backend.ngrok.io';
  }
}
