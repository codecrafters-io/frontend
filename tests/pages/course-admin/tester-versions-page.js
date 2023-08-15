import { clickable, collection, create, visitable } from 'ember-cli-page-object';

export default create({
  clickOnSyncWithGitHubButton: clickable('[data-test-sync-with-github-button]'),

  testerRepositoryLink: {
    scope: '[data-test-tester-repository-link]',
  },

  testerVersionListItem: collection('[data-test-version-list-item]'),

  visit: visitable('/courses/:course_slug/admin/tester-versions'),
});
