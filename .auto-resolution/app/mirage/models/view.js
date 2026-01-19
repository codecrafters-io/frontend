import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  viewer: belongsTo('user', { inverse: null }),
  resource: belongsTo('viewable', { inverse: null, polymorphic: true }),
});
