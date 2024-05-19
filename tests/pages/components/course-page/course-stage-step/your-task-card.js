import { clickOnText, text } from 'ember-cli-page-object';

export default {
  clickOnActionButton: clickOnText('[data-test-action-button]'),
  footerText: text('[data-test-footer-text]'),
  scope: '[data-test-your-task-card]',
};
