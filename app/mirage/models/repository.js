import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  autofixRequests: hasMany('autofix-request', { inverse: 'repository' }),
  buildpack: belongsTo('buildpack', { inverse: null }),
  course: belongsTo('course', { inverse: null }),
  extensionActivations: hasMany('course-extension-activation', { inverse: 'repository' }),
  courseStageCompletions: hasMany('course-stage-completion', { inverse: 'repository' }),
  courseStageFeedbackSubmissions: hasMany('course-stage-feedback-submission', { inverse: 'repository' }),
  githubRepositorySyncConfigurations: hasMany('github-repository-sync-configuration', { inverse: 'repository' }),
  user: belongsTo('user', { inverse: 'repositories' }),
  language: belongsTo('language', { inverse: null }),
  lastSubmission: belongsTo('submission', { inverse: null }),
  stageList: belongsTo('repository-stage-list', { inverse: 'repository' }),
  submissions: hasMany('submission', { inverse: 'repository' }),
});
