import { attribute, clickable, collection, create, visitable } from 'ember-cli-page-object';

export default create({
  clickOnSyncWithGitHubButton: clickable('[data-test-sync-with-github-button]'),

  testerRepositoryLink: {
    scope: '[data-test-tester-repository-link]',
    href: attribute('href'),
  },

  testerVersionListItem: collection('[data-test-version-list-item]', {
    activateButton: {
      scope: '[data-test-activate-button]',
    },
  }),

  visit: visitable('/courses/:course_slug/admin/tester-versions'),
});
