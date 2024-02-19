import { clickable, clickOnText, collection, fillable, hasClass, text } from 'ember-cli-page-object';
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

  // codeExamplesTab: codeExamplesTab,

  // languageDropdown: {
  //   currentLanguageName: text('[data-test-language-dropdown-trigger] [data-test-current-language-name]', { resetScope: true }),
  //   toggle: clickable('[data-test-language-dropdown-trigger]', { resetScope: true }),
  //   clickOnLink: clickOnText('div[role="button"]'),

  //   hasLink(text) {
  //     return this.links.toArray().some((link) => link.text.includes(text));
  //   },

  //   links: collection('div[role="button"]', {
  //     text: text(),
  //   }),

  //   resetScope: true,
  //   scope: '[data-test-language-dropdown-content]',
  // },

  title: text('[data-test-course-stage-solution-modal-title]'),
  scope: '[data-test-course-stage-solution-modal]',
};
