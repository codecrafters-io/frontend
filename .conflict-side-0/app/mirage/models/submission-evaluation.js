import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  submission: belongsTo('submission', { inverse: 'evaluations' }),
});
