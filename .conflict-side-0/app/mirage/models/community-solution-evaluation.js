import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  communitySolution: belongsTo('community-course-stage-solution', { inverse: 'evaluations' }),
  evaluator: belongsTo('community-solution-evaluator', { inverse: 'evaluations' }),
});
