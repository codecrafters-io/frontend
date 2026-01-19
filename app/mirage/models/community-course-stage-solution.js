import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  comments: hasMany('community-course-stage-solution-comment', { inverse: 'target' }),
  courseStage: belongsTo('course-stage', { inverse: 'communitySolutions' }),
  currentUserDownvotes: hasMany('downvote', { inverse: 'downvotable' }),
  currentUserUpvotes: hasMany('upvote', { inverse: 'upvotable' }),
  evaluations: hasMany('community-solution-evaluation', { inverse: 'communitySolution' }),
  exports: hasMany('community-solution-export', { inverse: 'communitySolution' }),
  language: belongsTo('language', { inverse: null }),
  screencasts: hasMany('course-stage-screencast', { inverse: null }),
  trustedEvaluations: hasMany('trusted-community-solution-evaluation', { inverse: 'communitySolution' }),
  user: belongsTo('user', { inverse: null }),
  verifications: hasMany('community-solution-verification', { inverse: 'communitySolution' }),
});
