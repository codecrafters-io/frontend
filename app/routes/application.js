import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import { SERIALIZER_SHOEBOX_IDENTIFIER } from 'codecrafters-frontend/serializers/application';

export default class ApplicationRoute extends Route {
  @service store;
  @service fastboot;

  async beforeModel() {
    if (!this.fastboot.isFastBoot) {
      // Extract pre-rendered & cached records from shoebox cache
      const shoeboxRecords = this.fastboot.shoebox.retrieve(SERIALIZER_SHOEBOX_IDENTIFIER) || [];

      // Inject all shoebox cache records into the store
      this.store.pushPayload({ data: shoeboxRecords });
    }
  }
}
