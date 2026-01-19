import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  stage: belongsTo('course-stage', { inverse: 'participations' }),
  user: belongsTo('user', { inverse: null }),
  language: belongsTo('language', { inverse: null }),
  repository: belongsTo('repository', { inverse: null }),
});
