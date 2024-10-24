import { attribute, clickable, collection, create, visitable } from 'ember-cli-page-object';

export default create({
  applyUpdateButton: {
    scope: '[data-test-apply-update-button]',
  },

  clickOnSyncWithGitHubButton: clickable('[data-test-sync-with-github-button]'),

  errorMessage: {
    scope: '[data-test-error-message]',
  },

  fileContentsDiff: {
    expandableChunks: collection('[data-test-expandable-chunk]'),

    scope: '[data-test-file-contents-diff]',
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
