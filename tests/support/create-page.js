import { create } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import Header from 'codecrafters-frontend/tests/pages/components/header';

export default function createPage(properties) {
  return create({
    accountDropdown: AccountDropdown,
    header: Header,

    ...properties,
  });
}
