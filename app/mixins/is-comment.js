/* eslint-disable ember/no-new-mixins */
import Mixin from '@ember/object/mixin';
import { attr } from '@ember-data/model';
import { underscore } from '@ember/string';
import { pluralize } from 'ember-inflector';
import config from '../config/environment';

export default Mixin.create({
  approvalStatus: attr('string'),
  bodyMarkdown: attr('string'),
  downvotesCount: attr('number'),
  score: attr('number'),
  upvotesCount: attr('number'),

  get adminPanelUrl() {
    return `${config.x.backendUrl}/admin/${pluralize(underscore(this.constructor.modelName))}/${this.id}`;
  },

  get adminPanelEditUrl() {
    return `${config.x.backendUrl}/admin/${pluralize(underscore(this.constructor.modelName))}/${this.id}/edit`;
  },

  get childComments() {
    return this.target.comments.filter((comment) => comment.parentComment && comment.parentComment.id === this.id);
  },

  get isApproved() {
    return this.approvalStatus === 'approved';
  },

  get isAwaitingApproval() {
    return this.approvalStatus === 'awaiting_approval';
  },

  get isRejected() {
    return this.approvalStatus === 'rejected';
  },

  get isTopLevelComment() {
    return !this.parentComment;
  },
});
