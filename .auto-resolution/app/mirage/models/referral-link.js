import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  user: belongsTo('user', { inverse: 'referralLinks' }),
  activations: hasMany('referral-activation', { inverse: 'referralLink' }),
});
