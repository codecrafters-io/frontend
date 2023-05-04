/* eslint-disable ember/no-mixins */
import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { memberAction } from 'ember-api-actions';

import UpvotableMixin from '../mixins/upvotable';
import DownvotableMixin from '../mixins/downvotable';

export default class CommunityCourseStageSolutionCommentModel extends Model.extend(UpvotableMixin, DownvotableMixin) {
  @service('current-user') currentUserService;

  @belongsTo('community-course-stage-solution', { async: false }) target;
  @belongsTo('language', { async: false }) language;
  @belongsTo('user', { async: false }) user;
  @belongsTo('community-course-stage-solution-comment', { async: false, inverse: null }) parentComment;

  @attr('number') upvotesCount;
  @attr('number') downvotesCount;
  @attr('boolean') isApprovedByModerator;
  @attr('date') createdAt;
  @attr('date') updatedAt;
  @attr('string') bodyMarkdown;

  get solution() {
    return this.target;
  }

  set solution(value) {
    this.target = value;
  }

  get childComments() {
    return this.target.comments.filter((comment) => comment.parentComment && comment.parentComment.id === this.id);
  }

  get isTopLevelComment() {
    return !this.parentComment;
  }
}

CommunityCourseStageSolutionCommentModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  before() {
    this.currentUserUpvotes.toArray().forEach((record) => {
      this.upvotesCount -= 1;
      record.unloadRecord();
    });

    this.currentUserDownvotes.toArray().forEach((record) => {
      this.downvotesCount -= 1;
      record.unloadRecord();
    });
  },
});
