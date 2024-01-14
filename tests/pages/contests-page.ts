import { triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  timeRemainingStatusPill: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-time-remaining-status-pill]',
  },

  visit: visitable('/contests/:contest_slug'),
});
