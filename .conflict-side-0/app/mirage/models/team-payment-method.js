import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  creator: belongsTo('user', { inverse: null }),
  team: belongsTo('team', { inverse: 'paymentMethods' }),
});
