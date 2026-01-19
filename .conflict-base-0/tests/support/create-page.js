import { clickable, create } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import Header from 'codecrafters-frontend/tests/pages/components/header';

export default function createPage(properties) {
  return create({
    accountDropdown: AccountDropdown,
    clickOnModalBackdrop: clickable('[data-test-modal-backdrop]'),
    header: Header,

    ...properties,
  });
}
