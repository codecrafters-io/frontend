import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  concept: belongsTo('concept', { inverse: 'questions' }),
});
