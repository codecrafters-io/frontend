import { clickable, create, triggerable, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';

export default create({
  accountDropdown: AccountDropdown,

  profileDescription: {
    input: {
      blur: triggerable('blur'),
      scope: '[data-test-profile-description-input]',
    },
  },

  anonymousModeToggle: {
    toggle: clickable('[data-test-profile-anonymous-mode-toggle]', { resetScope: true }),
  },

  visit: visitable('/settings/profile'),
});
