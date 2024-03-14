import { attribute, clickable, collection, create, triggerable, visitable } from 'ember-cli-page-object';

export default create({
  clickOnSyncWithGitHubButton: clickable('[data-test-sync-with-github-button]'),

  testerRepositoryLink: {
    scope: '[data-test-tester-repository-link]',
    href: attribute('href'),
  },

  testerVersionListItem: collection('[data-test-version-list-item]', {
    viewTesterVersionButton: {
      scope: '[data-test-view-tester-version-button]',
    },


    provisionedTestRunnersCount: {
      hover: triggerable('mouseenter'),
      scope: '[data-test-provisioned-test-runners-count]',
    },
  }),

  visit: visitable('/courses/:course_slug/admin/tester-versions'),
});
