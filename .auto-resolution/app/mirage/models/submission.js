import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  autofixRequests: hasMany('autofix-request', { inverse: 'submission' }),
  courseStage: belongsTo('course-stage', { inverse: null }),
  communitySolution: belongsTo('community-course-stage-solution', { inverse: null }),
  testerVersion: belongsTo('course-tester-version', { inverse: null }),
  repository: belongsTo('repository', { inverse: 'submissions' }),
  evaluations: hasMany('submission-evaluation', { inverse: 'submission' }),
});
