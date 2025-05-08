import Component from '@glimmer/component';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import type TeamModel from 'codecrafters-frontend/models/team';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';

export default class AccountDropdownComponent extends Component {
  @service declare authenticator: AuthenticatorService;
  @service declare darkMode: DarkModeService;
  @service declare featureFlags: FeatureFlagsService;
  @service declare router: RouterService;
  @service declare store: Store;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  @action
  handleCreateTeamClick(dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.router.transitionTo('teams.create');
  }

  @action
  handleForumLinkClick(dropdownActions: { close: () => void }) {
    window.open('https://forum.codecrafters.io/session/sso', '_blank');
    dropdownActions.close();
  }

  @action
  handleGetHelpClick(dropdownActions: { close: () => void }) {
    // @ts-expect-error Beacon not registered yet
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
  async handleManageSubscriptionClick(dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.router.transitionTo('settings.billing');
  }

  @action
  handleManageTeamClick(dropdownActions: { close: () => void }, team: TeamModel) {
    dropdownActions.close();
    this.router.transitionTo('team', team.id);
  }

  @action
  handlePartnerDashboardClick(dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.router.transitionTo('partner');
  }

  @action
  handlePerksLinkClick(dropdownActions: { close: () => void }) {
    window.open('https://codecrafters.io/perks', '_blank');
    dropdownActions.close();
  }

  @action
  handleReferralsLinkClick(dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.router.transitionTo('refer');
  }

  @action
  handleSettingsLinkClick(dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.router.transitionTo('settings');
  }

  @action
  handleSubscribeClick(dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.router.transitionTo('pay');
  }

  @action
  handleViewProfileClick(dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.router.transitionTo('user', this.authenticator.currentUsername!);
  }

  @action
  handleViewTeamClick(dropdownActions: { close: () => void }, team: TeamModel) {
    dropdownActions.close();
    this.router.transitionTo('team', team.id);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Header::AccountDropdown': typeof AccountDropdownComponent;
  }
}
