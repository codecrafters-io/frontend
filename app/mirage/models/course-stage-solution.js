import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  courseStage: belongsTo('course-stage', { inverse: 'solutions' }),
  language: belongsTo('language', { inverse: null }),
});
