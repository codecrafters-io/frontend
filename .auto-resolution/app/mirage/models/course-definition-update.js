import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  course: belongsTo('course', { inverse: 'definitionUpdates' }),
  applier: belongsTo('user', { inverse: null }),
});
