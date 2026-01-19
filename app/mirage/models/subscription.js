import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  source: belongsTo('subscription-source', { inverse: null, polymorphic: true }),
  user: belongsTo('user', { inverse: 'subscriptions' }),
});
