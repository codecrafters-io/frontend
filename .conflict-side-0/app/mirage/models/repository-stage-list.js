import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  repository: belongsTo('repository', { inverse: 'stageList' }),
  items: hasMany('repository-stage-list-item', { inverse: 'list' }),
});
