import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  currentCourseStage: belongsTo('course-stage', { inverse: null }),
  language: belongsTo('language', { inverse: null }),
  user: belongsTo('user', { inverse: null }),
});
