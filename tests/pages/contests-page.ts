import { clickable, text, triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  clickOnHeaderNextContestButton: clickable('[data-test-header-next-contest-button]'),
  clickOnHeaderPreviousContestButton: clickable('[data-test-header-previous-contest-button]'),
  clickOnPrizeNextContestButton: clickable('[data-test-prize-next-contest-button]'),
  clickOnPrizePreviousContestButton: clickable('[data-test-prize-previous-contest-button]'),
  nameText: text('[data-test-contest-name]'),

  timeRemainingStatusPill: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-time-remaining-status-pill]',
  },

  visit: visitable('/contests/:contest_slug'),
});
