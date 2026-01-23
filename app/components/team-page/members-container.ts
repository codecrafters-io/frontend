import { service } from '@ember/service';
import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type TeamModel from 'codecrafters-frontend/models/team';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    team: TeamModel;
  };
}

export default class TeamPageMembersContainer extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get currentUserIsTeamAdmin() {
    if (!this.authenticator.currentUser) {
      return false;
    }

    return this.args.team.admins.includes(this.authenticator.currentUser);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPage::MembersContainer': typeof TeamPageMembersContainer;
  }
}
