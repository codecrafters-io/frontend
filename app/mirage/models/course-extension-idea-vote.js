import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  courseExtensionIdea: belongsTo('course-extension-idea', { inverse: 'currentUserVotes' }),
  user: belongsTo('user', { inverse: 'courseExtensionIdeaVotes' }),
});
