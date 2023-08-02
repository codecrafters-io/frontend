import { clickable, collection, create, clickOnText, visitable } from 'ember-cli-page-object';

export default create({
  clickOnLink: clickOnText(),
  clickOnSyncWithGithubButton: clickable('[data-test-sync-with-github-button]'),

  updateListItems: collection('[data-test-update-list-item]', {
    clickOnViewUpdateButton: clickable('[data-test-view-update-button]'),
  }),

  visit: visitable('/courses/:course_slug/admin/updates'),
});
