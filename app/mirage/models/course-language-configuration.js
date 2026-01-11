import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  course: belongsTo('course', { inverse: 'languageConfigurations' }),
  language: belongsTo('language', { inverse: 'courseConfigurations' }),
});
