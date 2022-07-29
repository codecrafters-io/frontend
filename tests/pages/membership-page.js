import { clickable, create, text, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import Header from 'codecrafters-frontend/tests/pages/components/header';

export default create({
  accountDropdown: AccountDropdown,
  clickOnCancelTrialButton: clickable('[data-test-cancel-trial-button]'),
  membershipPlanSection: {
    descriptionText: text('[data-test-membership-plan-description]'),
    scope: '[data-test-membership-plan-section]',
  },
  header: Header,
  visit: visitable('/membership'),
});
