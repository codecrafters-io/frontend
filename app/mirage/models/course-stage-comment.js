import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  user: belongsTo('user', { inverse: null }),
  target: belongsTo('course-stage', { inverse: 'comments' }),
  language: belongsTo('language', { inverse: null }),
  currentUserDownvotes: hasMany('downvote', { inverse: 'downvotable' }),
  currentUserUpvotes: hasMany('upvote', { inverse: 'upvotable' }),
  parentComment: belongsTo('course-stage-comment', { inverse: null }),
});
