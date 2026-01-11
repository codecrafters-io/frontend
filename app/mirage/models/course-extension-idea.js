import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  course: belongsTo('course', { inverse: 'extensionIdeas' }),
  currentUserVotes: hasMany('course-extension-idea-vote', { inverse: 'courseExtensionIdea' }),
});
