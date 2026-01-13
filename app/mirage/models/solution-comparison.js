import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  firstSolution: belongsTo('community-course-stage-solution', { inverse: null }),
  secondSolution: belongsTo('community-course-stage-solution', { inverse: null }),
});
