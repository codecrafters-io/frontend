import { clickOnText, clickable, collection, fillable, hasClass, text } from 'ember-cli-page-object';
import CommentCard from '../comment-card';

export default {
  get isOpen() {
    return this.isVisible;
  },

  clickOnCloseButton: clickable('[data-test-close-modal-button]'),
  clickOnHeaderTabLink: clickOnText('[data-test-header-tab-link]'),
  clickOnNextStageButton: clickable('[data-test-next-stage-button]'),
  clickOnPreviousStageButton: clickable('[data-test-previous-stage-button]'),

  commentsTab: {
    clickOnTabHeader: clickOnText('[data-test-tab-header]'),
    clickOnSubmitButton: clickable('[data-test-submit-button]'),
    submitButtonIsDisabled: hasClass('cursor-not-allowed', '[data-test-submit-button]'),
    commentCards: collection('[data-test-comment-card]', CommentCard),
    fillInCommentInput: fillable('[data-test-comment-input]'),
    scope: '[data-test-comments-tab]',
  },

  title: text('[data-test-course-stage-solution-modal-title]'),
  scope: '[data-test-course-stage-solution-modal]',
};
