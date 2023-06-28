import { Factory } from 'miragejs';

export default Factory.extend({
  upvotesCount: () => 0,
  downvotesCount: () => 0,

  afterCreate(comment) {
    comment.target.update('approvedCommentsCount', comment.target.comments.models.filterBy('approvalStatus', 'approved').length);
  },
});
