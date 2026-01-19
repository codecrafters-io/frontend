import { Model, hasMany } from 'miragejs';

export default Model.extend({
  currentUserVotes: hasMany('course-idea-vote', { inverse: 'courseIdea' }),
});
