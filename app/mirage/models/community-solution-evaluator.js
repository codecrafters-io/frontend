import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  course: belongsTo('course', { inverse: null }),
  language: belongsTo('language', { inverse: null }),
  evaluations: hasMany('community-solution-evaluation', { inverse: 'evaluator' }),
  trustedEvaluations: hasMany('trusted-community-solution-evaluation', { inverse: 'evaluator' }),
});
