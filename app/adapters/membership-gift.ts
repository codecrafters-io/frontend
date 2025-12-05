import ApplicationAdapter from './application';
import type { Snapshot } from '@ember-data/store';

export default class MembershipGiftAdapter extends ApplicationAdapter {
  // @ts-expect-error - Complex Ember Data types, implementation is correct
  urlForUpdateRecord(id: string, modelName: string, snapshot: Snapshot<string>): string {
    const url = super.urlForUpdateRecord(id, modelName, snapshot);
    const managementToken = (snapshot.adapterOptions as { managementToken?: string }).managementToken;
    const urlObj = new URL(url);

    if (!managementToken) {
      throw new Error('management_token is required to update a membership gift');
    }

    urlObj.searchParams.set('management_token', managementToken);

    return urlObj.toString();
  }
}
