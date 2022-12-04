import { Factory } from 'miragejs';

export default Factory.extend({
  upvotesCount: () => 0,
  downvotesCount: () => 0,

  afterCreate(courseStageComment) {
    courseStageComment.courseStage.update(
      'approvedCommentsCount',
      courseStageComment.courseStage.comments.models.filterBy('isApprovedByModerator').length
    );
  },
});
