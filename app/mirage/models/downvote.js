import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  user: belongsTo('user', { inverse: null }),
  downvotable: belongsTo('downvotable', { inverse: null, polymorphic: true }),
});
