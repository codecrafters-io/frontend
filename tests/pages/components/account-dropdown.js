import { clickOnText, clickable } from 'ember-cli-page-object';

export default {
  toggle: clickable('[data-test-account-dropdown-trigger]', { resetScope: true }),
  clickOnLink: clickOnText('div[role="button"]'),
  scope: '[data-test-account-dropdown-content]',
};
