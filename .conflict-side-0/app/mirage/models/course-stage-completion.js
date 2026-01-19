import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  courseStage: belongsTo('course-stage', { inverse: null }),
  repository: belongsTo('repository', { inverse: 'courseStageCompletions' }),
  submission: belongsTo('submission', { inverse: null }),
  badgeAwards: hasMany('badge-award', { inverse: 'courseStageCompletion' }),
});
