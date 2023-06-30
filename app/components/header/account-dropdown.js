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
  handleCreateTeamClick(dropdownActions) {
    dropdownActions.close();
    this.router.transitionTo('teams.create');
  }

  @action
  handleCommunityClick(dropdownActions) {
    window.open('https://discord.gg/DeqUD2P', '_blank');
    dropdownActions.close();
  }

  @action
  handleGetHelpClick(dropdownActions) {
    if (this.currentUser) {
      window.Beacon('prefill', {
        email: this.currentUser.primaryEmailAddress,
      });
    }
    window.Beacon('open');
    dropdownActions.close();
  }

  @action
  handleLogoutClick() {
    this.store.createRecord('session').logout();
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
  handleManageTeamClick(dropdownActions, team) {
    dropdownActions.close();
    this.router.transitionTo('team', team.id);
  }

  @action
  async handleManageSubscriptionClick(dropdownActions) {
    dropdownActions.close();
    this.router.transitionTo('membership');
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
