import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  course: belongsTo('course', { inverse: 'buildpacks' }),
  language: belongsTo('language', { inverse: null }),
});
