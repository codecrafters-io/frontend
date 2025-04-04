import { attribute, clickable, create, visitable } from 'ember-cli-page-object';
import codeMirror from 'codecrafters-frontend/tests/pages/components/code-mirror';

export default create({
  applyUpdateButton: {
    scope: '[data-test-apply-update-button]',
  },

  clickOnSyncWithGitHubButton: clickable('[data-test-sync-with-github-button]'),

  errorMessage: {
    scope: '[data-test-error-message]',
  },

  fileContentsDiff: {
    scope: '[data-test-file-contents-diff]',
    codeMirror,
  },

  description: {
    scope: '[data-test-description]',
  },

  viewDiffLink: {
    scope: '[data-test-view-diff-link]',
    href: attribute('href'),
  },

  visit: visitable('/courses/:course_slug/admin/updates/:update_id'),
});
