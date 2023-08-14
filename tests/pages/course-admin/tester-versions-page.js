import { clickable, collection, create, visitable } from 'ember-cli-page-object';

export default create({
  clickOnSyncWithGithubButton: clickable('[data-test-sync-with-github-button]'),

  testerRepositoryLink: {
    scope: '[data-test-tester-repository-link]',
  },

  testerVersionListItem: collection('[data-test-version-list-item]', {
    activateButton: {
      scope: '[data-test-activate-button]',
    },

    header: {
      scope: '[data-test-version-list-item-header]',
    },
  }),

  visit: visitable('/courses/:course_slug/admin/tester-versions'),
});
