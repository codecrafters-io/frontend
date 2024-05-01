import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
/* eslint-disable ember/no-mixins */
import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { memberAction } from 'ember-api-actions';

import UpvotableMixin from '../mixins/upvotable';
import DownvotableMixin from '../mixins/downvotable';
import IsCommentMixin from '../mixins/is-comment';

import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type UserModel from 'codecrafters-frontend/models/user';

export default class CommunityCourseStageSolutionCommentModel extends Model.extend(UpvotableMixin, DownvotableMixin, IsCommentMixin) {
  @attr('date') declare createdAt: Date;
  @attr('string') declare subtargetLocator: string; // filename.js or filename.js:line1-line2
  @attr('date') declare updatedAt: Date;

  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;
  @belongsTo('community-course-stage-solution-comment', { async: false, inverse: null })
  declare parentComment: CommunityCourseStageSolutionCommentModel;

  @belongsTo('community-course-stage-solution', { async: false, inverse: 'comments' }) declare target: CommunityCourseStageSolutionModel;
  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;

  @service declare authenticator: AuthenticatorService; // used by UpvotableMixin and DownvotableMixin

  get contextForUserLabel() {
    return this.target.courseStage.course;
  }

  get filename() {
    return this.subtargetLocator.split(':')[0];
  }

  get solution() {
    return this.target;
  }

  get subtargetEndLine() {
    return this.subtargetLines.endLine;
  }

  get subtargetLines() {
    if (!this.subtargetLocator.includes(':')) {
      return { startLine: null, endLine: null };
    }

    const lines = this.subtargetLocator.split(':')[1]!.split('-') as [string, string];
    const startLine = parseInt(lines[0], 10);
    const endLine = parseInt(lines[1], 10);

    return { startLine, endLine };
  }

  get subtargetStartLine() {
    return this.subtargetLines.startLine;
  }

  set solution(value) {
    this.target = value;
  }

  declare unvote: (this: Model, payload: unknown) => Promise<void>;
}

CommunityCourseStageSolutionCommentModel.prototype.unvote = memberAction({
  path: 'unvote',
  type: 'post',

  before() {
    // @ts-expect-error Model mixin methods/properties are not recognized
    for (const record of [...this.currentUserUpvotes]) {
      // @ts-expect-error Model mixin methods/properties are not recognized
      this.upvotesCount -= 1;
      record.unloadRecord();
    }

    // @ts-expect-error Model mixin methods/properties are not recognized
    for (const record of [...this.currentUserDownvotes]) {
      // @ts-expect-error Model mixin methods/properties are not recognized
      this.downvotesCount -= 1;
      record.unloadRecord();
    }
  },
});
