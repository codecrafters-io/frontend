import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  concept: belongsTo('concept', { inverse: 'engagements' }),
  user: belongsTo('user', { inverse: 'conceptEngagements' }),
});
