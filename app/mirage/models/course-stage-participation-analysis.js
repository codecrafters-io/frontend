import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  stage: belongsTo('course-stage', { inverse: 'participationAnalyses' }),
});
