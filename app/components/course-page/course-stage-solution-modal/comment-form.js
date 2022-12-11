import Component from '@glimmer/component';
import Prism from 'prismjs';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { next } from '@ember/runloop';

export default class CommentFormComponent extends Component {
  @service('current-user') currentUserService;
  @service store;

  @tracked comment;
  @tracked isSaving = false;
  @tracked activeTab = 'write';
  @tracked isEditingComment = false;

  constructor() {
    super(...arguments);

    if (this.args.comment) {
      this.comment = this.args.comment;
      this.isEditingComment = true;
    } else {
      this.setNewComment();
    }
  }

  @action
  setActiveTab(tab) {
    this.activeTab = tab;
  }

  get bodyHTML() {
    return htmlSafe(new showdown.Converter().makeHtml(this.comment.bodyMarkdown || 'Nothing to preview'));
  }

  get currentUser() {
    return this.currentUserService.record;
  }

  @action
  handleDidInsertBodyHTML(element) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleEditCancelButtonClick() {
    this.args.onCancel();
  }

  @action
  handleCancelReplyButtonClick() {
    this.args.onCancel();
  }

  @action
  async handleFormSubmit(e) {
    e.preventDefault();
    e.target.reportValidity();

    if (e.target.checkValidity()) {
      if (!this.args.comment) {
        this.comment.courseStage = this.args.courseStage || this.args.parentComment.courseStage;
      }

      this.isSaving = true;
      await this.comment.save();
      this.isSaving = false;

      if (this.args.onSubmit) {
        this.args.onSubmit();
      } else {
        this.setNewComment();
      }
    }
  }

  @action
  handleWillDestroy() {
    next(() => {
      if (this.isEditingComment) {
        this.comment.rollbackAttributes();
      } else if (this.comment.isNew && !this.comment.isSaving) {
        this.comment.unloadRecord();
      }
    });
  }

  get isReplying() {
    return !!this.args.parentComment;
  }

  get placeholderText() {
    if (this.isReplying) {
      return 'Write a reply';
    } else {
      return 'Found an interesting resource? Share it with the community.';
    }
  }

  setNewComment() {
    // TODO: We're setting courseStage later since this interferes with the comment listing somehow
    if (this.args.parentComment) {
      this.comment = this.store.createRecord('course-stage-comment', {
        // courseStage: this.args.parentComment.courseStage,
        user: this.currentUser,
        language: this.args.parentComment.language,
        parentComment: this.args.parentComment,
      });
    } else {
      this.comment = this.store.createRecord('course-stage-comment', {
        // courseStage: this.args.courseStage,
        user: this.currentUser,
        language: this.args.language,
      });
    }
  }

  get submitButtonIsDisabled() {
    return !this.comment.bodyMarkdown || this.comment.bodyMarkdown.trim().length < 1 || this.isSaving;
  }
}
