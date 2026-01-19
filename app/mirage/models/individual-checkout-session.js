import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  regionalDiscount: belongsTo('regional-discount', { inverse: null }),
  promotionalDiscount: belongsTo('promotional-discount', { inverse: null }),
});
