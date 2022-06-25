import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import window from 'ember-window-mock';

export default class SubscribtionSettingsContainerComponent extends Component {
  @tracked isCreatingTeamBillingSession = false;
  @service('globalModals') globalModalsService;
  @service('current-user') currentUserService;
  @service store;

  @action
  async handleManageSubscriptionButtonClick() {
    this.isCreatingTeamBillingSession = true;
    let teamBillingSession = this.store.createRecord('team-billing-session');
    await teamBillingSession.save();
    window.location.href = teamBillingSession.url;
  }

  get currentUserIsTeamAdmin() {
    return this.args.team.admins.includes(this.currentUserService.record);
  }
}
