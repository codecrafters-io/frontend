import { clickable, collection, create, isVisible, text, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import CheckoutSessionSuccessfulModal from 'codecrafters-frontend/tests/pages/components/checkout-session-successful-modal';

export default create({
  accountDropdown: AccountDropdown,
  clickOnManageSubscriptionButton: clickable('[data-test-manage-subscription-button]'),
  confirmMemberDeletionModal: CheckoutSessionSuccessfulModal,
  inviteURLDescription: text('[data-test-invite-url-description]'),

  members: collection('[data-test-members-list-item-container]', {
    clickRemoveButton: clickable('[data-test-remove-button]'),
  }),

  subscriptionSettingsContainer: {
    hasManageSubscriptionButton: isVisible('[data-test-manage-subscription-button]'),
    scope: '[data-test-subscription-settings-container]',
  },

  visit: visitable('/teams/:team_id'),
});
