import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type TeamModel from 'codecrafters-frontend/models/team';
import type TeamMembershipModel from 'codecrafters-frontend/models/team-membership';

type SortDirection = 'asc' | 'desc';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    team: TeamModel;
  };
}

export default class TeamPageMembersTable extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  @tracked lastSeenSortDirection: SortDirection | null = null;

  get currentUserIsTeamAdmin() {
    if (!this.authenticator.currentUser) {
      return false;
    }

    return this.args.team.admins.includes(this.authenticator.currentUser);
  }

  get sortedMemberships(): TeamMembershipModel[] {
    const memberships = this.args.team.memberships.slice();

    // If user clicked Last Seen header, sort by that
    if (this.lastSeenSortDirection) {
      const dir = this.lastSeenSortDirection === 'asc' ? 1 : -1;

      return memberships.sort((a, b) => {
        const aTime = a.lastAttemptAt ? a.lastAttemptAt.getTime() : 0;
        const bTime = b.lastAttemptAt ? b.lastAttemptAt.getTime() : 0;

        return (aTime - bTime) * dir;
      });
    }

    // Default sort: attempts desc, then last seen desc, then joined desc
    return memberships.sort((a, b) => {
      const stagesDiff = (b.numberOfStageAttempts || 0) - (a.numberOfStageAttempts || 0);

      if (stagesDiff !== 0) {
        return stagesDiff;
      }

      const aLastSeen = a.lastAttemptAt ? a.lastAttemptAt.getTime() : 0;
      const bLastSeen = b.lastAttemptAt ? b.lastAttemptAt.getTime() : 0;

      if (aLastSeen !== bLastSeen) {
        return bLastSeen - aLastSeen;
      }

      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  @action
  handleLastSeenSortClick() {
    if (this.lastSeenSortDirection === 'desc') {
      this.lastSeenSortDirection = 'asc';
    } else if (this.lastSeenSortDirection === 'asc') {
      this.lastSeenSortDirection = null; // back to default
    } else {
      this.lastSeenSortDirection = 'desc';
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPage::MembersTable': typeof TeamPageMembersTable;
  }
}
