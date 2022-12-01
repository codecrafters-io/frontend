import Component from '@glimmer/component';
import Prism from 'prismjs';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

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
    this.comment.rollbackAttributes();
    this.args.onCancel();
  }

  @action
  async handleFormSubmit(e) {
    e.preventDefault();
    e.target.reportValidity();

    if (e.target.checkValidity()) {
      this.isSaving = true;
      await this.comment.save();
      this.isSaving = false;

      this.setNewComment();
    }

    this.args.onSubmit();
  }

  setNewComment() {
    this.comment = this.store.createRecord('course-stage-comment', {
      courseStage: this.args.courseStage,
      user: this.currentUser,
      language: this.args.language,
    });
  }

  get submitButtonIsDisabled() {
    return !this.comment.bodyMarkdown || this.comment.bodyMarkdown.trim().length < 1 || this.isSaving;
  }
}
