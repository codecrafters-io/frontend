import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  submission: belongsTo('submission', { inverse: 'autofixRequests' }),
  repository: belongsTo('repository', { inverse: 'autofixRequests' }),
});
