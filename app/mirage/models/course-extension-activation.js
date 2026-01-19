import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  extension: belongsTo('course-extension', { inverse: null }),
  repository: belongsTo('repository', { inverse: 'extensionActivations' }),
});
