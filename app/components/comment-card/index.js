import Prism from 'prismjs';
import 'prismjs/components/prism-diff';
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
import 'prismjs/components/prism-zig';
//
import Component from '@glimmer/component';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export default class CommentCard extends Component {
  @service authenticator;
  @service store;

  @tracked isEditing = false;
  @tracked shouldShowReplyForm = false;
  @tracked rejectedChildCommentsAreExpanded = false;

  get allChildComments() {
    return this.args.comment.childComments.filter((item) => !item.isNew).sort(fieldComparator('createdAt'));
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get rejectedChildComments() {
    return this.allChildComments.filter((comment) => comment.isRejected);
  }

  get visibleChildComments() {
    return this.allChildComments.filter(
      (comment) => (this.currentUser?.isStaff ? !comment.isRejected : comment.isApproved) || comment.user === this.currentUser,
    );
  }

  @action
  handleCancelReplyButtonClick() {
    this.shouldShowReplyForm = false;
  }

  @action
  handleDeleteButtonClick() {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      this.args.comment.destroyRecord();
      this.args.comment.childComments.forEach((childComment) => childComment.unloadRecord());
    }
  }

  @action
  handleDidInsertBodyHTML(element) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleEditButtonClick() {
    this.isEditing = true;
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
  handleToggleRejectedChildCommentsButtonClick() {
    this.rejectedChildCommentsAreExpanded = !this.rejectedChildCommentsAreExpanded;
  }

  @action
  updateCommentStatus(status, dropdownActions) {
    dropdownActions.close();
    this.args.comment.approvalStatus = status;
    this.args.comment.save();
  }
}
