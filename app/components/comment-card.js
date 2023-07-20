import Component from '@glimmer/component';
import Prism from 'prismjs';
import showdown from 'showdown';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-nim';
// import 'prismjs/components/prism-php'; Doesn't work for some reason?
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-clojure';
import 'prismjs/components/prism-crystal';
import 'prismjs/components/prism-elixir';
import 'prismjs/components/prism-haskell';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-swift';

import 'prismjs/components/prism-diff';

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
      }).makeHtml(this.args.comment.bodyMarkdown),
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
