import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  author: belongsTo('user', { inverse: null }),
  engagements: hasMany('concept-engagement', { inverse: 'concept' }),
  questions: hasMany('concept-question', { inverse: 'concept' }),
});
