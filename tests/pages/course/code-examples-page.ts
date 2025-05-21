import { collection, clickable, hasClass, triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';
import LanguageDropdown from 'codecrafters-frontend/tests/pages/components/language-dropdown';
import FileContentsCard from 'codecrafters-frontend/tests/pages/components/file-contents-card';
import CommentCard from 'codecrafters-frontend/tests/pages/components/comment-card';

export default createPage({
  languageDropdown: LanguageDropdown,
  scope: '[data-test-code-examples-page]',

  solutionCards: collection('[data-test-community-solution-card]', {
    changedFiles: collection('[data-test-community-solution-changed-file]'),
    clickOnExpandButton: clickable('[data-test-expand-button]'),
    collapseButtons: collection('[data-test-collapse-button]'),
    commentCards: collection('[data-test-comment-card]', CommentCard),

    diffSourceSwitcher: {
      changedFilesIconIsActive: hasClass('bg-white', '[data-test-changed-files-icon]'),
      highlightedFilesIconIsActive: hasClass('bg-white', '[data-test-highlighted-files-icon]'),
      scope: '[data-test-diff-source-switcher]',
    },

    downvoteButton: {
      hover: triggerable('mouseenter'),
      isInactive: hasClass('opacity-50'),
      scope: '[data-test-solution-card-downvote-button]',
    },

    toggleCommentsButtons: collection('[data-test-toggle-comments-button]'),
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
