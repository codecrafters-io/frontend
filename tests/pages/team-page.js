import { clickable, collection, create, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import CheckoutSessionSuccessfulModal from 'codecrafters-frontend/tests/pages/components/checkout-session-successful-modal';

export default create({
  accountDropdown: AccountDropdown,
  confirmMemberDeletionModal: CheckoutSessionSuccessfulModal,

  members: collection('[data-test-members-list-item-container]', {
    clickRemoveButton: clickable('[data-test-remove-button]'),
  }),

  visit: visitable('/teams/:id'),
});
