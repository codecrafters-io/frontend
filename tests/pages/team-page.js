import { clickable, clickOnText, collection, create, isVisible, text, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';

export default create({
  accountDropdown: AccountDropdown,
  clickOnManageSubscriptionButton: clickable('[data-test-manage-subscription-button]'),
  inviteURLDescription: text('[data-test-invite-url-description]'),

  members: collection('[data-test-members-list-item-container]', {
    clickLeaveTeamButton: clickable('[data-test-leave-team-button]'),
    clickRemoveButton: clickable('[data-test-remove-button]'),
    username: text('[data-test-username]'),
  }),

  memberByUsername(username) {
    return this.members.toArray().findBy('username', username);
  },

  pilotDetailsContainer: {
    detailsText: text('[data-test-details-text]'),
    scope: '[data-test-pilot-details-container]',
  },

  slackIntegrationSettingsContainer: {
    hasUninstallButton: isVisible('[data-test-uninstall-button]'),
    scope: '[data-test-slack-integration-settings-container]',
  },

  subscriptionSettingsContainer: {
    hasManageSubscriptionButton: isVisible('[data-test-manage-subscription-button]'),
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
