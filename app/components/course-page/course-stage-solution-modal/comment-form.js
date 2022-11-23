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

  @tracked newComment;
  @tracked isSaving = false;
  @tracked activeTab = 'write';

  constructor() {
    super(...arguments);
    this.setNewComment();
  }

  @action
  setActiveTab(tab) {
    this.activeTab = tab;
  }

  get bodyHTML() {
    return htmlSafe(new showdown.Converter().makeHtml(this.newComment.bodyMarkdown || 'Nothing to preview'));
  }

  @action
  handleDidInsertBodyHTML(element) {
    Prism.highlightAllUnder(element);
  }

  get currentUser() {
    return this.currentUserService.record;
  }

  @action
  async handleFormSubmit(e) {
    e.preventDefault();
    e.target.reportValidity();

    if (e.target.checkValidity()) {
      this.isSaving = true;
      await this.newComment.save();
      this.isSaving = false;

      this.setNewComment();
    }
  }

  setNewComment() {
    this.newComment = this.store.createRecord('course-stage-comment', {
      courseStage: this.args.courseStage,
      user: this.currentUser,
      language: this.args.language,
    });
  }

  get submitButtonIsDisabled() {
    return !this.newComment.bodyMarkdown || this.newComment.bodyMarkdown.trim().length < 1 || this.isSaving;
  }
}
