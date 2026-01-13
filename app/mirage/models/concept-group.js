import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  author: belongsTo('user', { inverse: null }),
  concepts: hasMany('concept', { inverse: null }),
});
