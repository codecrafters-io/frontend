import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import window from 'ember-window-mock';

export default class HeaderAccountDropdownComponent extends Component {
  @service('currentUser') currentUserService;
  @service('globalModals') globalModalsService;
  @tracked isCreatingBillingSession = false;
  @service router;
  @service serverVariables;
  @service store;

  get currentUser() {
    return this.currentUserService.record;
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
    window.Beacon('open');
    dropdownActions.close();
  }

  @action
  handleLogoutClick() {
    // https://stackoverflow.com/a/24766685
    let f = document.createElement('form');
    f.action = `${this.serverVariables.get('serverUrl')}/logout`;
    f.method = 'POST';
    // f.target='_blank';

    document.body.appendChild(f);
    f.submit();
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
  handleViewTeamClick(dropdownActions, team) {
    dropdownActions.close();
    this.router.transitionTo('team', team.id);
  }
}
