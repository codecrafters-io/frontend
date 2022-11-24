import Model from '@ember-data/model';
import { attr, belongsTo, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { memberAction } from 'ember-api-actions';

export default class CourseStageCommentModel extends Model {
  @service('current-user') currentUserService;

  @belongsTo('course-stage', { async: false }) courseStage;
  @belongsTo('language', { async: false }) language;
  @belongsTo('user', { async: false }) user;

  @hasMany('course-stage-comment-upvote', { async: false }) currentUserUpvotes;
  @hasMany('course-stage-comment-downvote', { async: false }) currentUserDownvotes;

  @attr('number') upvotesCount;
  @attr('number') downvotesCount;
  @attr('boolean') isApprovedByModerator;
  @attr('date') createdAt;
  @attr('date') updatedAt;
  @attr('string') bodyMarkdown;

  async upvote() {
    if (this.currentUserDownvotes.length > 0) {
      await this.unvote();
    }

    if (this.currentUserUpvotes.length > 0) {
      return;
    }

    this.upvotesCount += 1;

    let upvote = this.store.createRecord('course-stage-comment-upvote', { courseStageComment: this, user: this.currentUserService.record });
    this.currentUserUpvotes.addObject(upvote);

    await upvote.save();
  }

  async downvote() {
    if (this.currentUserUpvotes.length > 0) {
      await this.unvote();
    }

    if (this.currentUserDownvotes.length > 0) {
      return;
    }

    this.downvotesCount += 1;

    let downvote = this.store.createRecord('course-stage-comment-downvote', { courseStageComment: this, user: this.currentUserService.record });
    this.currentUserDownvotes.addObject(downvote);

    await downvote.save();
  }
}

CourseStageCommentModel.prototype.unvote = memberAction({
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
