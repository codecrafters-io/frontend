import { triggerable, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  deleteAccountModal: {
    deleteAccountButton: {
      press: triggerable('mousedown'),
      scope: '[data-test-delete-account-button]',
    },

    scope: '[data-test-delete-account-modal]',
  },

  deleteMyAccountButton: {
    scope: '[data-test-delete-my-account-button]',
  },

  visit: visitable('/settings/account'),
});
