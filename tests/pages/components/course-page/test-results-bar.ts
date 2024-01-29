import SubmissionLogsPreview from 'codecrafters-frontend/tests/pages/components/submission-logs-preview';
import { clickable, clickOnText, collection, triggerable } from 'ember-cli-page-object';
import { find } from '@ember/test-helpers';

export default {
  autofixSection: {
    clickOnStartAutofixButton: clickable('[data-test-start-autofix-button]'),
    scope: '[data-test-autofix-section]',
  },

  clickOnBottomSection: clickable('[data-test-bottom-section]'),
  clickOnTab: clickOnText('[data-test-tab-header]'),
  logsPreview: SubmissionLogsPreview,

  resizeHandler: {
    mouseDown: triggerable('mousedown'),
    mouseMove: triggerable('mousemove'),
    mouseUp: triggerable('mouseup'),
    scope: '[data-test-resize-handler]',
    touchStart: triggerable('touchstart'),
    touchMove: triggerable('touchmove'),
    touchEnd: triggerable('touchend'),
  },

  scope: '[data-test-test-results-bar]',
  tabs: collection('[data-test-tab-header]'),

  get height() {
    const element = find('[data-test-test-results-bar]') as HTMLElement;

    return element?.offsetHeight;
  },

  get tabNames() {
    return this.tabs.map((tab) => tab.text);
  },
};
