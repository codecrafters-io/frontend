import Component from '@glimmer/component';
import Prism from 'prismjs';
import showdown from 'showdown';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CommentCardComponent extends Component {
  @service authenticator;
  @service store;
  @tracked isEditing = false;
  @tracked shouldShowReplyForm = false;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get currentUserIsStaff() {
    return this.currentUser && this.currentUser.isStaff;
  }

  get bodyHTML() {
    return htmlSafe(
      new showdown.Converter({
        simplifiedAutoLink: true,
        openLinksInNewWindow: true,
        strikethrough: true,
        disableForced4SpacesIndentedSublists: true,
      }).makeHtml(this.args.comment.bodyMarkdown)
    );
  }

  @action
  handleDidInsertBodyHTML(element) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleDeleteButtonClick() {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      this.args.comment.destroyRecord();
      this.args.comment.childComments.forEach((childComment) => childComment.unloadRecord());
    }
  }

  @action
  handleCancelReplyButtonClick() {
    this.shouldShowReplyForm = false;
  }

  @action
  handleReplyButtonClick() {
    this.shouldShowReplyForm = true;
  }

  @action
  handleReplySubmitted() {
    this.shouldShowReplyForm = false;
  }

  @action
  handleEditButtonClick() {
    this.isEditing = true;
  }

  get sortedChildComments() {
    return this.visibleChildComments.sortBy('createdAt');
  }

  get visibleChildComments() {
    let persistedComments = this.args.comment.childComments.rejectBy('isNew');

    if (this.currentUserIsStaff) {
      return persistedComments;
    } else {
      return persistedComments.filter((comment) => comment.isApproved || comment.user === this.authenticator.currentUser);
    }
  }
}
