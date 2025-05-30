import { collection, clickable, clickOnText, hasClass, triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';
import LanguageDropdown from 'codecrafters-frontend/tests/pages/components/language-dropdown';
import FileContentsCard from 'codecrafters-frontend/tests/pages/components/file-contents-card';
import CommentCard from 'codecrafters-frontend/tests/pages/components/comment-card';

export default createPage({
  languageDropdown: LanguageDropdown,
  scope: '[data-test-code-examples-page]',

  solutionCards: collection('[data-test-community-solution-card]', {
    changedFileCards: collection('[data-test-community-solution-changed-file-card]', {
      clickOnPublishToGithubButton: clickable('[data-test-publish-to-github-button]'),
    }),

    content: {
      scope: '[data-test-community-solution-card-content]',
    },

    clickOnExpandButton: clickable('[data-test-expand-button]'),
    collapseButtons: collection('[data-test-collapse-button]'),
    commentCards: collection('[data-test-comment-card]', CommentCard),

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
