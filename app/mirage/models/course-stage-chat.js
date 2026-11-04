import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  courseStage: belongsTo('course-stage', { inverse: null }),
  messages: hasMany('course-stage-chat-message', { inverse: 'chat' }),
  repository: belongsTo('repository', { inverse: null }),
});
