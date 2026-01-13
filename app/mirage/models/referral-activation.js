import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  customer: belongsTo('user', { inverse: 'referralActivationsAsCustomer' }),
  referrer: belongsTo('user', { inverse: 'referralActivationsAsReferrer' }),
  referralLink: belongsTo('referral-link', { inverse: 'activations' }),
});
