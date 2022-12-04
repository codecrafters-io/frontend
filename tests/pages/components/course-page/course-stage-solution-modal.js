import { clickable, clickOnText, collection, fillable, hasClass, text } from 'ember-cli-page-object';

export default {
  get isOpen() {
    return this.isVisible;
  },

  activeHeaderTabLinkText: text('[data-test-header-tab-link].border-teal-500'),
  clickOnCloseButton: clickable('[data-test-close-modal-button]'),
  clickOnHeaderTabLink: clickOnText('[data-test-header-tab-link]'),

  commentsTab: {
    clickOnTabHeader: clickOnText('[data-test-tab-header]'),
    clickOnSubmitButton: clickable('[data-test-submit-button]'),
    submitButtonIsDisabled: hasClass('opacity-50', '[data-test-submit-button]'),

    commentCards: collection('[data-test-comment-card]', {
      clickOnCancelButton: clickable('[data-test-cancel-button]'),
      clickOnDropdownLink: clickOnText('[data-test-more-dropdown-content] div[role="button"]'),
      clickOnUpdateCommentButton: clickable('[data-test-update-comment-button]'),
      commentBodyText: text('[data-test-comment-body]'),
      downvoteButton: { scope: '[data-test-downvote-button]' },
      commentInput: { scope: '[data-test-comment-input]' },
      toggleDropdown: clickable('[data-test-more-dropdown-toggle]'),
      upvoteButton: { scope: '[data-test-upvote-button]' },
    }),

    fillInCommentInput: fillable('[data-test-comment-input]'),
    scope: '[data-test-comments-tab]',
  },

  communitySolutionsTab: {
    blurredOverlay: {
      actionButtons: collection('[data-test-action-button]'),

      get availableActionButtons() {
        return this.actionButtons.map((button) => button.text);
      },

      clickOnActionButton: clickOnText('[data-test-action-button]'),
      instructionsText: text('[data-test-instructions-text]'),
      scope: '[data-test-blurred-overlay]',
    },
    solutionCards: collection('[data-test-community-solution-card]'),
    scope: '[data-test-community-solutions-tab]',
  },

  languageDropdown: {
    currentLanguageName: text('[data-test-language-dropdown-trigger] [data-test-current-language-name]', { resetScope: true }),
    toggle: clickable('[data-test-language-dropdown-trigger]', { resetScope: true }),
    clickOnLink: clickOnText('div[role="button"]'),

    hasLink(text) {
      return this.links.toArray().some((link) => link.text.includes(text));
    },

    links: collection('div[role="button"]', {
      text: text(),
    }),

    resetScope: true,
    scope: '[data-test-language-dropdown-content]',
  },

  requestedLanguageNotAvailableNotice: {
    scope: '[data-test-requested-language-not-available-notice]',
  },

  title: text('[data-test-course-stage-solution-modal-title]'),
  scope: '[data-test-course-stage-solution-modal]',
};
