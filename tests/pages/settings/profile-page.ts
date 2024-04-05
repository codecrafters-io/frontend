import { clickable, triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  anonymousModeToggle: {
    toggle: clickable('[data-test-anonymous-mode-toggle]', { resetScope: true }),
  },

  profileDescription: {
    input: {
      blur: triggerable('blur'),
      scope: '[data-test-profile-description-input]',
    },
  },

  visit: visitable('/settings/profile'),
});
