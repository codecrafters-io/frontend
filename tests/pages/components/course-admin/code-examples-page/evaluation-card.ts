import { clickOnText, fillable, value } from 'ember-cli-page-object';

export default {
  clickOnTabHeader: clickOnText('[data-test-tab-header]'),
  scope: '[data-test-evaluation-card]',

  trustedEvaluationTab: {
    scope: '[data-test-trusted-evaluation-tab]',
    fillInValue: fillable('select'),
    value: value('select'),
  },
};
