import { service } from '@ember/service';
import Component from '@glimmer/component';

export default class MembersContainer extends Component {
  @service authenticator;

  get currentUserIsTeamAdmin() {
    return this.args.team.admins.includes(this.authenticator.currentUser);
  }
}
