import { clickOnText, text } from 'ember-cli-page-object';

export default {
  clickOnTabHeader: clickOnText('[data-test-tab-header]'),
  scope: '[data-test-evaluation-card]',

  trustedEvaluationTab: {
    scope: '[data-test-trusted-evaluation-tab]',
    clickOnValue: clickOnText('[data-test-selectable-item]'),
    selectedItemText: text('[data-test-selectable-item].border-teal-500'),
  },
};
