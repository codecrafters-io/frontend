/* eslint-disable ember/no-new-mixins */
import Mixin from '@ember/object/mixin';
import { attr } from '@ember-data/model';

export default Mixin.create({
  isApprovedByModerator: attr('boolean'),
  downvotesCount: attr('number'),
  upvotesCount: attr('number'),
  bodyMarkdown: attr('string'),

  get childComments() {
    return this.target.comments.filter((comment) => comment.parentComment && comment.parentComment.id === this.id);
  },

  get isTopLevelComment() {
    return !this.parentComment;
  },

  // get isApproved() {
  //   return this.approvalStatus === 'approved';
  // },

  // get isRejected() {
  //   return this.approvalStatus === 'rejected';
  // },

  // get isAwaitingApproval() {
  //   return this.approvalStatus === 'awaiting_approval';
  // },
});
