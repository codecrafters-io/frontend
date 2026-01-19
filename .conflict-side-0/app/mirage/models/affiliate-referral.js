import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  customer: belongsTo('user', { inverse: 'affiliateReferralsAsCustomer' }),
  referrer: belongsTo('user', { inverse: 'affiliateReferralsAsReferrer' }),
  affiliateLink: belongsTo('affiliate-link', { inverse: 'referrals' }),
});
