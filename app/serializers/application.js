import JSONAPISerializer from '@ember-data/serializer/json-api';
import { service } from '@ember/service';

export const SERIALIZER_SHOEBOX_IDENTIFIER = 'application-serializer-data';

// Prerendered pages don't use these, and they'd make up most of each page's HTML.
// The course route reloads them before rendering a stage (see `CourseRoute#hasStagesWithoutInstructions`).
const ATTRIBUTES_EXCLUDED_FROM_SHOEBOX = {
  'course-stages': ['community-solution-counts', 'description-markdown-template', 'marketing-markdown'],
};

function withoutAttributesExcludedFromShoebox(hash) {
  const excludedAttributes = ATTRIBUTES_EXCLUDED_FROM_SHOEBOX[hash.type];

  if (!excludedAttributes || !hash.attributes) {
    return hash;
  }

  const attributes = { ...hash.attributes };
  excludedAttributes.forEach((attribute) => delete attributes[attribute]);

  return { ...hash, attributes };
}

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
      this.fastboot.shoebox.put(SERIALIZER_SHOEBOX_IDENTIFIER, [...shoeboxRecords, withoutAttributesExcludedFromShoebox(hash)]);
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
