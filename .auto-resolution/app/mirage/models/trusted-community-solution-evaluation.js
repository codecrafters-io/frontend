import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  communitySolution: belongsTo('community-course-stage-solution', { inverse: 'trustedEvaluations' }),
  evaluator: belongsTo('community-solution-evaluator', { inverse: 'trustedEvaluations' }),
  creator: belongsTo('user', { inverse: null }),
});
