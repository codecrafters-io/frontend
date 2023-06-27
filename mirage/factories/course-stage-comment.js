import { Factory } from 'miragejs';

export default Factory.extend({
  upvotesCount: () => 0,
  downvotesCount: () => 0,

  afterCreate(courseStageComment) {
    courseStageComment.target.update(
      'approvedCommentsCount',
      courseStageComment.target.comments.models.filterBy('approvalStatus', 'approved').length
    );
  },
});
