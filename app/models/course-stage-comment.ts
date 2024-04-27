import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Model, { attr, belongsTo } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';
import { inject as service } from '@ember/service';

import UpvotableMixin from '../mixins/upvotable';
import DownvotableMixin from '../mixins/downvotable';
import IsCommentMixin from '../mixins/is-comment';

import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type UserModel from 'codecrafters-frontend/models/user';

export default class CourseStageCommentModel extends Model.extend(UpvotableMixin, DownvotableMixin, IsCommentMixin) {
  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;

  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;
  @belongsTo('course-stage-comment', { async: false, inverse: null }) declare parentComment: CourseStageCommentModel;
  @belongsTo('course-stage', { async: false, inverse: 'comments' }) declare target: CourseStageModel;
  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;

  @service declare authenticator: AuthenticatorService; // used by UpvotableMixin and DownvotableMixin

  get childComments() {
    return this.target.comments.filter((comment) => comment.parentComment && comment.parentComment.id === this.id);
  }

  get contextForUserLabel() {
    return this.target.course;
  }

  get courseStage() {
    return this.target;
  }

  get isTopLevelComment() {
    return !this.parentComment;
  }

  set courseStage(value) {
    this.target = value;
  }

  declare unvote: (this: Model, payload: unknown) => Promise<void>;
}

CourseStageCommentModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  before() {
    // @ts-ignore Model mixin methods/properties are not recognized
    for (const record of [...this.currentUserUpvotes]) {
      // @ts-ignore Model mixin methods/properties are not recognized
      this.upvotesCount -= 1;
      record.unloadRecord();
    }

    // @ts-ignore Model mixin methods/properties are not recognized
    for (const record of [...this.currentUserDownvotes]) {
      // @ts-ignore Model mixin methods/properties are not recognized
      this.downvotesCount -= 1;
      record.unloadRecord();
    }
  },
});
