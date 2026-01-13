import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  courseStage: belongsTo('course-stage', { inverse: 'screencasts' }),
  language: belongsTo('language', { inverse: null }),
  user: belongsTo('user', { inverse: null }),
});
