import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { SERIALIZER_SHOEBOX_IDENTIFIER } from 'codecrafters-frontend/serializers/application';
import type FastBootService from 'ember-cli-fastboot/services/fastboot';
import type Store from '@ember-data/store';

export default class ApplicationRoute extends Route {
  @service declare fastboot: FastBootService;
  @service declare store: Store;

  async beforeModel() {
    if (!this.fastboot.isFastBoot) {
      // Extract pre-rendered & cached records from shoebox cache
      const shoeboxRecords = this.fastboot.shoebox.retrieve(SERIALIZER_SHOEBOX_IDENTIFIER) || [];

      // Inject all shoebox cache records into the store
      this.store.pushPayload({ data: shoeboxRecords });
    }
  }
}
