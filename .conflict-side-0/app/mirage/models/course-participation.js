import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  course: belongsTo('course', { inverse: null }),
  user: belongsTo('user', { inverse: 'courseParticipations' }),
  language: belongsTo('language', { inverse: null }),
});
