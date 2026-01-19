import JSONAPISerializer from '@ember-data/serializer/json-api';
import { service } from '@ember/service';

export const SERIALIZER_SHOEBOX_IDENTIFIER = 'application-serializer-data';

export default class ApplicationSerializer extends JSONAPISerializer {
  @service fastboot;

  normalize(typeClass, hash) {
    if (this.fastboot.isFastBoot) {
      // Throw human-readable error if FastBoot service is destroyed instead of "document is undefined"
      if (this.fastboot.isDestroyed) {
        throw new Error(`Attempted to write a record into shoebox using a destroyed FastBoot service: ${hash.type}`);
      }

      // Retrieve existing records from shoebox cache
      const shoeboxRecords = this.fastboot.shoebox.retrieve(SERIALIZER_SHOEBOX_IDENTIFIER) || [];

      // Update shoebox cache, adding the new record
      this.fastboot.shoebox.put(SERIALIZER_SHOEBOX_IDENTIFIER, [...shoeboxRecords, hash]);
    }

    return super.normalize(typeClass, hash);
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
