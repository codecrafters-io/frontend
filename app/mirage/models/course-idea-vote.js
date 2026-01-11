import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  courseIdea: belongsTo('course-idea', { inverse: 'currentUserVotes' }),
  user: belongsTo('user', { inverse: 'courseIdeaVotes' }),
});
