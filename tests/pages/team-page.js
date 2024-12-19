import { clickOnText, clickable, collection, create, isVisible, text, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';

export default create({
  accountDropdown: AccountDropdown,
  inviteURLDescription: text('[data-test-invite-url-description]'),

  members: collection('[data-test-members-list-item-container]', {
    clickLeaveTeamButton: clickable('[data-test-leave-team-button]'),
    clickRemoveButton: clickable('[data-test-remove-button]'),
    githubName: text('[data-test-github-name]'),
    username: text('[data-test-username]'),
  }),

  memberByGithubName(githubName) {
    return this.members.toArray().findBy('githubName', githubName);
  },

  memberByUsername(username) {
    return this.members.toArray().findBy('username', username);
  },

  setupSubscriptionContainer: {
    clickOnAddPaymentMethodButton: clickable('[data-test-add-payment-method-button]'),
    clickOnStartSubscriptionButton: clickable('[data-test-start-subscription-button]'),
    firstInvoiceDetailsText: text('[data-test-first-invoice-details]'),
    instructionsText: text('[data-test-instructions-text]'),
    pilotDetailsText: text('[data-test-pilot-details-text]'),
    scope: '[data-test-setup-subscription-container]',
  },

  slackIntegrationSettingsContainer: {
    hasUninstallButton: isVisible('[data-test-uninstall-button]'),
    scope: '[data-test-slack-integration-settings-container]',
  },

  subscriptionSettingsContainer: {
    instructionsText: text('[data-test-instructions-text]'),
    scope: '[data-test-subscription-settings-container]',
  },

  teamSelectionDropdown: {
    activeTeamName: text('[data-test-team-selection-dropdown-trigger]', { resetScope: true }),
    clickOnLink: clickOnText('div[role="button"]'),
    toggle: clickable('[data-test-team-selection-dropdown-trigger]', { resetScope: true }),
    scope: '[data-test-team-selection-dropdown-content]',
  },

  visit: visitable('/teams/:team_id'),
});
