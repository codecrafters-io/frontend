import { create } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import CheckoutSessionSuccessfulModal from 'codecrafters-frontend/tests/pages/components/checkout-session-successful-modal';
import Header from 'codecrafters-frontend/tests/pages/components/header';

export default function createPage(properties) {
  return create({
    accountDropdown: AccountDropdown,
    checkoutSessionSuccessfulModal: CheckoutSessionSuccessfulModal,
    header: Header,

    ...properties,
  });
}
