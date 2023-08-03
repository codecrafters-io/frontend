import JSONAPISerializer from '@ember-data/serializer/json-api';
import { inject as service } from '@ember/service';

export const SERIALIZER_SHOEBOX_IDENTIFIER = 'application-serializer-data';

export default class ApplicationSerializer extends JSONAPISerializer {
  @service fastboot;

  normalize(...args) {
    const normalizedRecord = super.normalize(...args);

    if (this.fastboot.isFastBoot) {
      // Retrieve existing records from shoebox cache
      const shoeboxRecords = this.fastboot.shoebox.retrieve(SERIALIZER_SHOEBOX_IDENTIFIER) || [];

      // Update shoebox cache, adding the new record
      this.fastboot.shoebox.put(SERIALIZER_SHOEBOX_IDENTIFIER, [...shoeboxRecords, normalizedRecord]);
    }

    return normalizedRecord;
  }
}
