import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  referralActivation: belongsTo('referral-activation', { inverse: null }),
  user: belongsTo('user', { inverse: null }),
});
