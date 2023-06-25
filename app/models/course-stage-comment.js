/* eslint-disable ember/no-mixins */
import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { memberAction } from 'ember-api-actions';

import UpvotableMixin from '../mixins/upvotable';
import DownvotableMixin from '../mixins/downvotable';

export default class CourseStageCommentModel extends Model.extend(UpvotableMixin, DownvotableMixin) {
  @service authenticator;

  @belongsTo('course-stage', { async: false }) target;
  @belongsTo('language', { async: false }) language;
  @belongsTo('user', { async: false }) user;
  @belongsTo('course-stage-comment', { async: false, inverse: null }) parentComment;

  @attr('number') upvotesCount;
  @attr('number') downvotesCount;
  @attr('boolean') isApprovedByModerator;
  @attr('date') createdAt;
  @attr('date') updatedAt;
  @attr('string') bodyMarkdown;

  get courseStage() {
    return this.target;
  }

  set courseStage(value) {
    this.target = value;
  }

  get childComments() {
    return this.target.comments.filter((comment) => comment.parentComment && comment.parentComment.id === this.id);
  }

  get isTopLevelComment() {
    return !this.parentComment;
  }
}

CourseStageCommentModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  before() {
    for (const record of [...this.currentUserUpvotes]) {
      this.upvotesCount -= 1;
      record.unloadRecord();
    }

    for (const record of [...this.currentUserDownvotes]) {
      this.downvotesCount -= 1;
      record.unloadRecord();
    }
  },
});
