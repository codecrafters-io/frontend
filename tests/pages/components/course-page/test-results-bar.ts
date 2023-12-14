import SubmissionLogsPreview from 'codecrafters-frontend/tests/pages/components/submission-logs-preview';
import { clickable, clickOnText, collection } from 'ember-cli-page-object';

export default {
  autofixSection: {
    clickOnStartAutofixButton: clickable('[data-test-start-autofix-button]'),
    scope: '[data-test-autofix-section]',
  },

  clickOnBottomSection: clickable('[data-test-bottom-section]'),
  clickOnTab: clickOnText('[data-test-tab-header]'),
  logsPreview: SubmissionLogsPreview,
  scope: '[data-test-test-results-bar]',
  tabs: collection('[data-test-tab-header]'),

  get tabNames() {
    return this.tabs.map((tab) => tab.text);
  },
};
