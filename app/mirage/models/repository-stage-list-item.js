import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  list: belongsTo('repository-stage-list', { inverse: 'items' }),
  stage: belongsTo('course-stage', { inverse: null }),
});
