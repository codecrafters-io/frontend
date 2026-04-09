import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type TeamModel from 'codecrafters-frontend/models/team';
import type TeamMembershipModel from 'codecrafters-frontend/models/team-membership';

type TimePeriod = 'all' | '3m' | '6m' | '1y';
type SortDirection = 'asc' | 'desc';

const PERIOD_OPTIONS: { value: TimePeriod; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: '3m', label: '3 months' },
  { value: '6m', label: '6 months' },
  { value: '1y', label: '1 year' },
];

interface Signature {
  Element: HTMLDivElement;

  Args: {
    team: TeamModel;
    enablePeriodFilter: boolean;
  };
}

export default class TeamPageMembersTable extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  @tracked selectedPeriod: TimePeriod = 'all';
  @tracked lastSeenSortDirection: SortDirection | null = null;
  @tracked isPeriodDropdownOpen = false;

  periodOptions = PERIOD_OPTIONS;

  get currentUserIsTeamAdmin() {
    if (!this.authenticator.currentUser) {
      return false;
    }

    return this.args.team.admins.includes(this.authenticator.currentUser);
  }

  get selectedPeriodLabel(): string {
    return PERIOD_OPTIONS.find((o) => o.value === this.selectedPeriod)!.label;
  }

  @action
  getAttempts(membership: TeamMembershipModel): number {
    switch (this.selectedPeriod) {
      case '3m':
        return membership.numberOfAttempts3m || 0;
      case '6m':
        return membership.numberOfAttempts6m || 0;
      case '1y':
        return membership.numberOfAttempts1y || 0;
      default:
        return membership.numberOfStageAttempts || 0;
    }
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

  @action
  handlePeriodSelect(period: TimePeriod) {
    this.selectedPeriod = period;
    this.isPeriodDropdownOpen = false;
  }

  @action
  togglePeriodDropdown() {
    this.isPeriodDropdownOpen = !this.isPeriodDropdownOpen;
  }

  @action
  closePeriodDropdown() {
    this.isPeriodDropdownOpen = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPage::MembersTable': typeof TeamPageMembersTable;
  }
}
