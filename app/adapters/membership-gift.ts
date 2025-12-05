import ApplicationAdapter from './application';
import type { Snapshot } from '@ember-data/store';

export default class MembershipGiftAdapter extends ApplicationAdapter {
  // @ts-expect-error - Complex Ember Data types, implementation is correct
  urlForUpdateRecord(id: string, modelName: string, snapshot: Snapshot<string>): string {
    const url = super.urlForUpdateRecord(id, modelName, snapshot);
    const urlObj = new URL(url);

    if (snapshot.adapterOptions?.['managementToken']) {
      urlObj.searchParams.set('management_token', snapshot.adapterOptions['managementToken'] as string);
    }

    return urlObj.toString();
  }
}
