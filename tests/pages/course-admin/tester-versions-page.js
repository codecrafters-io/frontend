import { clickable, collection, create, visitable } from 'ember-cli-page-object';

export default create({
  clickOnSyncWithGithubButton: clickable('[data-test-sync-with-github-button]'),

  testerRepositoryLink: {
    scope: '[data-test-tester-repository-link]',
  },

  testerVersionListItem: collection('[data-test-version-list-item]', {
    clickOnActivateButton: clickable('[data-test-activate-button]'),
  }),

  visit: visitable('/courses/:course_slug/admin/tester-versions'),
});
