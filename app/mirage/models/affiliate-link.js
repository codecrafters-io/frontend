import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  user: belongsTo('user', { inverse: 'affiliateLinks' }),
  referrals: hasMany('affiliate-referral', { inverse: 'affiliateLink' }),
});
