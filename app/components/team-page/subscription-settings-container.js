import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class SubscribtionSettingsContainerComponent extends Component {
  @service('current-user') currentUserService;
  @service store;

  get currentUserIsTeamAdmin() {
    return this.args.team.admins.includes(this.currentUserService.record);
  }
}
