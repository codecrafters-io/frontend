import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  course: belongsTo('course', { inverse: null }),
  language: belongsTo('language', { inverse: null }),
  user: belongsTo('user', { inverse: 'courseLanguageRequests' }),
});
