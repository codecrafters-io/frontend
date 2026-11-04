import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  chat: belongsTo('course-stage-chat', { inverse: 'messages' }),
  courseStage: belongsTo('course-stage', { inverse: null }),
  repository: belongsTo('repository', { inverse: null }),
});
