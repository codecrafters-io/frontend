import JSONAPISerializer from '@ember-data/serializer/json-api';
import { inject as service } from '@ember/service';

export const SERIALIZER_SHOEBOX_IDENTIFIER = 'application-serializer-data';

export default class ApplicationSerializer extends JSONAPISerializer {
  @service fastboot;

  normalize(...args) {
    if (this.fastboot.isFastBoot) {
      // Get the record's original resorce hash that was passed in arguments
      const [, resourceHash] = args;

      // Retrieve existing records from shoebox cache
      const shoeboxRecords = this.fastboot.shoebox.retrieve(SERIALIZER_SHOEBOX_IDENTIFIER) || [];

      // Update shoebox cache, adding the new record
      this.fastboot.shoebox.put(SERIALIZER_SHOEBOX_IDENTIFIER, [...shoeboxRecords, resourceHash]);
    }

    return super.normalize(...args);
  }

  normalizeQueryRecordResponse(store, primaryModelClass, payload, id, requestType) {
    if (payload.data instanceof Array) {
      if (payload.data.length > 0) {
        payload.data = payload.data[0];
      } else {
        payload.data = null;
      }
    }

    return super.normalizeQueryRecordResponse(store, primaryModelClass, payload, id, requestType);
  }
}
