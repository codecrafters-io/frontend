import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  course: belongsTo('course', { inverse: 'stages' }),
  communitySolutionsAnalyses: hasMany('community-solutions-analysis', { inverse: 'courseStage' }),
  comments: hasMany('course-stage-comment', { inverse: 'target' }),
  communitySolutions: hasMany('community-course-stage-solution', { inverse: 'courseStage' }),
  participations: hasMany('course-stage-participation', { inverse: 'stage' }),
  participationAnalyses: hasMany('course-stage-participation-analysis', { inverse: 'stage' }),
  solutions: hasMany('course-stage-solution', { inverse: 'courseStage' }),
  screencasts: hasMany('course-stage-screencast', { inverse: 'courseStage' }),
});
