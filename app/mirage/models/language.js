import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  courseConfigurations: hasMany('course-language-configuration', { inverse: 'language' }),
  leaderboard: belongsTo('leaderboard', { inverse: 'language' }),
  primerConceptGroup: belongsTo('concept-group', { inverse: null }),
});
