import { service } from '@ember/service';
import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type TeamModel from 'codecrafters-frontend/models/team';
import type TeamMembershipModel from 'codecrafters-frontend/models/team-membership';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    team: TeamModel;
  };
}

export default class TeamPageMembersTable extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get currentUserIsTeamAdmin() {
    if (!this.authenticator.currentUser) {
      return false;
    }

    return this.args.team.admins.includes(this.authenticator.currentUser);
  }

  get sortedMemberships(): TeamMembershipModel[] {
    return this.args.team.memberships.slice().sort((a, b) => {
      // Primary: stages descending
      const stagesDiff = (b.numberOfStageAttempts || 0) - (a.numberOfStageAttempts || 0);

      if (stagesDiff !== 0) {
        return stagesDiff;
      }

      // Secondary: last seen descending (most recent first)
      const aLastSeen = a.lastAttemptAt ? a.lastAttemptAt.getTime() : 0;
      const bLastSeen = b.lastAttemptAt ? b.lastAttemptAt.getTime() : 0;

      if (aLastSeen !== bLastSeen) {
        return bLastSeen - aLastSeen;
      }

      // Tertiary: joined descending (most recent first)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPage::MembersTable': typeof TeamPageMembersTable;
  }
}
