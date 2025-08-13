import { collection, clickable, clickOnText, hasClass, isVisible, text, triggerable, visitable } from 'ember-cli-page-object';

import createPage from 'codecrafters-frontend/tests/support/create-page';
import CommentCard from 'codecrafters-frontend/tests/pages/components/comment-card';
import FileContentsCard from 'codecrafters-frontend/tests/pages/components/file-contents-card';
import LanguageDropdown from 'codecrafters-frontend/tests/pages/components/language-dropdown';

export default createPage({
  languageDropdown: LanguageDropdown,
  scope: '[data-test-code-examples-page]',

  solutionCards: collection('[data-test-community-solution-card]', {
    changedFileCards: collection('[data-test-community-solution-changed-file-card]', {
      clickOnPublishToGithubButton: clickable('[data-test-publish-to-github-button]'),
      clickOnViewOnGithubButton: clickable('[data-test-view-on-github-button]'),
    }),

    hasViewOnGithubButton: isVisible('[data-test-view-on-github-button]'),
    hasDirectGithubLink: isVisible('a[href*="github.com"]'),

    content: {
      scope: '[data-test-community-solution-card-content]',
    },

    clickOnExpandButton: clickable('[data-test-expand-button]'),
    collapseButtons: collection('[data-test-collapse-button]'),
    commentCards: collection('[data-test-comment-card]', CommentCard),

    highlightedFileCards: collection('[data-test-community-solution-highlighted-file-card]', {
      clickOnPublishToGithubButton: clickable('[data-test-publish-to-github-button]'),
      clickOnViewOnGithubButton: clickable('[data-test-view-on-github-button]'),
      viewOnGithubButtonIsDisabled: hasClass('opacity-50', '[data-test-view-on-github-button]'),
      viewOnGithubButtonText: text('[data-test-view-on-github-button]'),
    }),

    downvoteButton: {
      hover: triggerable('mouseenter'),
      isInactive: hasClass('opacity-50'),
      scope: '[data-test-solution-card-downvote-button]',
    },

    get isCollapsed() {
      return !this.isExpanded;
    },

    get isExpanded() {
      return (this.content as unknown as { isVisible: boolean }).isVisible;
    },

    moreDropdown: {
      clickOnLink: clickOnText('[data-test-dropdown-link]'),

      hasLink(linkText: string) {
        return this.links.length > 0 && this.links.toArray().some((link) => link.text === linkText);
      },

      links: collection('[data-test-dropdown-link]', {
        click: clickable(),
      }),

      resetScope: true,
      scope: '[data-test-more-dropdown-content]',
    },

    toggleCommentsButtons: collection('[data-test-toggle-comments-button]'),
    toggleMoreDropdown: clickable('[data-test-more-dropdown-toggle]'),
    unchangedFiles: collection('[data-test-community-solution-unchanged-file]', FileContentsCard),

    upvoteButton: {
      hover: triggerable('mouseenter'),
      isInactive: hasClass('opacity-50'),
      scope: '[data-test-solution-card-upvote-button]',
    },
  }),

  stageIncompleteModal: {
    clickOnInstructionsButton: clickable('[data-test-instructions-button]'),
    clickOnShowCodeButton: clickable('[data-test-show-code-button]'),
    scope: '[data-test-stage-incomplete-modal]',
  },

  visit: visitable('/courses/:course_slug/stages/:stage_slug/code-examples'),
});
