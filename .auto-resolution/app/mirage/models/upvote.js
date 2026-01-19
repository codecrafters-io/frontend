import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  user: belongsTo('user', { inverse: null }),
  upvotable: belongsTo('upvotable', { inverse: null, polymorphic: true }),
});
