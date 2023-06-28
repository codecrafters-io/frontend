/* eslint-disable ember/no-mixins */
import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { memberAction } from 'ember-api-actions';

import UpvotableMixin from '../mixins/upvotable';
import DownvotableMixin from '../mixins/downvotable';
import IsCommentMixin from '../mixins/is-comment';

export default class CommunityCourseStageSolutionCommentModel extends Model.extend(UpvotableMixin, DownvotableMixin, IsCommentMixin) {
  @service authenticator; // used by UpvotableMixin and DownvotableMixin

  @belongsTo('community-course-stage-solution', { async: false, inverse: 'comments' }) target;
  @belongsTo('language', { async: false, inverse: null }) language;
  @belongsTo('user', { async: false, inverse: null }) user;
  @belongsTo('community-course-stage-solution-comment', { async: false, inverse: null }) parentComment;

  @attr('date') createdAt;
  @attr('date') updatedAt;
  @attr('string') subtargetLocator; // filename.js or filename.js:line1-line2

  get solution() {
    return this.target;
  }

  set solution(value) {
    this.target = value;
  }

  get filename() {
    return this.subtargetLocator.split(':')[0];
  }

  get subtargetLines() {
    if (!this.subtargetLocator.includes(':')) {
      return { startLine: null, endLine: null };
    }

    const [startLine, endLine] = this.subtargetLocator.split(':')[1].split('-');

    return { startLine, endLine };
  }

  get subtargetStartLine() {
    return this.subtargetLines.startLine;
  }

  get subtargetEndLine() {
    return this.subtargetLines.endLine;
  }
}

CommunityCourseStageSolutionCommentModel.prototype.unvote = memberAction({
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
