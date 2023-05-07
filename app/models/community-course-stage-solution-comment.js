/* eslint-disable ember/no-mixins */
import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { memberAction } from 'ember-api-actions';

import UpvotableMixin from '../mixins/upvotable';
import DownvotableMixin from '../mixins/downvotable';

export default class CommunityCourseStageSolutionCommentModel extends Model.extend(UpvotableMixin, DownvotableMixin) {
  @service('current-user') currentUserService;

  @belongsTo('community-course-stage-solution', { async: false, inverse: 'comments' }) target;
  @belongsTo('language', { async: false, inverse: null }) language;
  @belongsTo('user', { async: false, inverse: null }) user;
  @belongsTo('community-course-stage-solution-comment', { async: false, inverse: null }) parentComment;

  @attr('number') upvotesCount;
  @attr('number') downvotesCount;
  @attr('boolean') isApprovedByModerator;
  @attr('date') createdAt;
  @attr('date') updatedAt;
  @attr('string') bodyMarkdown;
  @attr('string') subtargetLocator; // filename.js or filename.js:line1-line2

  get solution() {
    return this.target;
  }

  set solution(value) {
    this.target = value;
  }

  get childComments() {
    return this.target.comments.filter((comment) => comment.parentComment && comment.parentComment.id === this.id);
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

  get isTopLevelComment() {
    return !this.parentComment;
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
