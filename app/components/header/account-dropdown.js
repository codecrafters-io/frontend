import Component from '@glimmer/component';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class HeaderAccountDropdownComponent extends Component {
  @service authenticator;
  @service colorScheme;
  @service router;
  @service store;

  @tracked isCreatingBillingSession = false;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  @action
  handleCommunityClick(dropdownActions) {
    window.open('https://discord.gg/DeqUD2P', '_blank');
    dropdownActions.close();
  }

  @action
  handleCreateTeamClick(dropdownActions) {
    dropdownActions.close();
    this.router.transitionTo('teams.create');
  }

  @action
  handleGetHelpClick(dropdownActions) {
    window.Beacon('open');
    dropdownActions.close();
  }

  @action
  async handleLogoutClick() {
    await this.router.transitionTo('catalog'); // Isn't safe to logout on any page that assumes "User" is not-null
    const logoutResponse = await this.store.createRecord('session').logout();

    if (logoutResponse.redirect_url) {
      window.location.href = logoutResponse.redirect_url;
    }
  }

  @action
  async handleManageSubscriptionClick(dropdownActions) {
    dropdownActions.close();
    this.router.transitionTo('membership');
  }

  @action
  handleManageTeamClick(dropdownActions, team) {
    dropdownActions.close();
    this.router.transitionTo('team', team.id);
  }

  @action
  handlePartnerDashboardClick(dropdownActions) {
    dropdownActions.close();
    this.router.transitionTo('partner');
  }

  @action
  handlePerksLinkClick(dropdownActions) {
    window.open('https://codecrafters.io/perks', '_blank');
    dropdownActions.close();
  }

  @action
  handleReferralsLinkClick(dropdownActions) {
    dropdownActions.close();
    this.router.transitionTo('refer');
  }

  @action
  handleStatusPageClick(dropdownActions) {
    window.open('https://status.codecrafters.io/', '_blank');
    dropdownActions.close();
  }

  @action
  handleSubscribeClick(dropdownActions) {
    dropdownActions.close();
    this.router.transitionTo('pay');
  }

  @action
  handleTestSentryClick() {
    this.testingSentry.boom();
  }

  @action
  handleViewProfileClick(dropdownActions) {
    dropdownActions.close();
    this.router.transitionTo('user', this.authenticator.currentUsername);
  }

  @action
  handleViewTeamClick(dropdownActions, team) {
    dropdownActions.close();
    this.router.transitionTo('team', team.id);
  }
}
