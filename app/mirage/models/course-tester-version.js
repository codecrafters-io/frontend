import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  course: belongsTo('course', { inverse: 'testerVersions' }),
  activator: belongsTo('user', { inverse: null }),
});
