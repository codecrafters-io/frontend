import ApplicationAdapter from './application';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import type { Snapshot } from '@ember-data/store';

export default class MembershipGiftAdapter extends ApplicationAdapter {
  @service declare router: RouterService;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // @ts-expect-error - Complex Ember Data types, implementation is correct
  urlForUpdateRecord(id: string, modelName: string, snapshot: Snapshot<string>): string {
    const url = super.urlForUpdateRecord(id, modelName, snapshot);
    const managementToken = this.router.currentRoute?.params['management_token'];

    if (managementToken) {
      const separator = url.includes('?') ? '&' : '?';

      return `${url}${separator}management_token=${encodeURIComponent(managementToken)}`;
    }

    return url;
  }
}
