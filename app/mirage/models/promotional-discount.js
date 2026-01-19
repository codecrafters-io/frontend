import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  affiliateReferral: belongsTo('affiliate-referral', { inverse: null }),
  user: belongsTo('user', { inverse: 'promotionalDiscounts' }),
});
