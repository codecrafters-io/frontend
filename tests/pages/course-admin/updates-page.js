import { attribute, clickable, collection, create, clickOnText, visitable } from 'ember-cli-page-object';

export default create({
  clickOnLink: clickOnText(),

  definitionRepositoryLink: {
    scope: '[data-test-definition-repository-link]',
    href: attribute('href'),
    click: clickable(),
  },

  updateListItems: collection('[data-test-update-list-item]', {
    clickOnViewUpdateButton: clickable('[data-test-view-update-button]'),
  }),

  visit: visitable('/courses/:course_slug/admin/updates'),
});
