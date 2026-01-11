import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  courseStage: belongsTo('course-stage', { inverse: null }),
  language: belongsTo('language', { inverse: null }),
  repository: belongsTo('repository', { inverse: 'courseStageFeedbackSubmissions' }),
  user: belongsTo('user', { inverse: null }),
});
