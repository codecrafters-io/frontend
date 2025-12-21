import { service } from '@ember/service';
import Component from '@glimmer/component';

export default class SubscribtionSettingsContainer extends Component {
  @service authenticator;
  @service store;

  get currentUserIsTeamAdmin() {
    return this.args.team.admins.includes(this.authenticator.currentUser);
  }
}
