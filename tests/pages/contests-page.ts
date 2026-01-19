import { clickable, text, triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  headerNavigation: {
    clickOnNextContestButton: clickable('[data-test-next-contest-button]'),
    clickOnPreviousContestButton: clickable('[data-test-previous-contest-button]'),
    scope: '[data-test-header-navigation]',
  },

  nameText: text('[data-test-contest-name]'),

  prizeDetailsNavigation: {
    clickOnNextContestButton: clickable('[data-test-next-contest-button]'),
    clickOnPreviousContestButton: clickable('[data-test-previous-contest-button]'),
    scope: '[data-test-prize-details-navigation]',
  },

  timeRemainingStatusPill: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-time-remaining-status-pill]',
  },

  visit: visitable('/contests/:contest_slug'),
});
