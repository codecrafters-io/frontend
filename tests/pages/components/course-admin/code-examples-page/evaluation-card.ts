import { clickOnText, clickable, isPresent, text } from 'ember-cli-page-object';

export default {
  clickOnTabHeader: clickOnText('[data-test-tab-header]'),
  scope: '[data-test-evaluation-card]',

  trustedEvaluationTab: {
    scope: '[data-test-trusted-evaluation-tab]',
    clickOnCorrectButton: clickable('[data-test-correct-button]'),
    clickOnWrongButton: clickable('[data-test-wrong-button]'),
    clickOnEditTrustedEvaluationButton: clickable('[data-test-edit-trusted-evaluation-button]'),
    hasTrustedEvaluation: isPresent('[data-test-trusted-evaluation-message]'),
    trustedEvaluationMatchesText: text('[data-test-trusted-evaluation-message]'),
    trustedResult: text('[data-test-trusted-result]'),
    evaluationResult: text('[data-test-evaluation-result]'),
  },
};
