import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  badge: belongsTo('badge', { inverse: null }),
  user: belongsTo('user', { inverse: 'badgeAwards' }),
  courseStageCompletion: belongsTo('course-stage-completion', { inverse: 'badgeAwards' }),
});
