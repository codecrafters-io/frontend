import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = 'api/v1';
  @service serverVariables;

  get host() {
    return this.serverVariables.get('serverUrl');
  }
}
