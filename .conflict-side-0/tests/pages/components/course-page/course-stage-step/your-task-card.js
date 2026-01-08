import { clickOnText, text } from 'ember-cli-page-object';

export default {
  clickOnActionButton: clickOnText('[data-test-action-button]'),
  clickOnCollapseButton: clickOnText('[data-test-collapse-button]'),
  clickOnExpandButton: clickOnText('[data-test-expand-button]'),
  footerText: text('[data-test-footer-text]'),
  scope: '[data-test-your-task-card]',
};
