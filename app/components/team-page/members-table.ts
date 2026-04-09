import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type TeamModel from 'codecrafters-frontend/models/team';
import type TeamMembershipModel from 'codecrafters-frontend/models/team-membership';

type TimePeriod = 'all' | '3m' | '6m' | '1y';
type SortColumn = 'member' | 'lastSeen' | 'joined' | 'attempts' | 'courses';
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
  };
}

export default class TeamPageMembersTable extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  @tracked selectedPeriod: TimePeriod = 'all';
  @tracked sortColumn: SortColumn = 'attempts';
  @tracked sortDirection: SortDirection = 'desc';
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

  getCourseCount(membership: TeamMembershipModel): number {
    const courses = membership.user.courseParticipations.map((item) => item.course);
    const uniqueCourses = new Set(courses.map((c) => c.id));

    return uniqueCourses.size;
  }

  getMemberName(membership: TeamMembershipModel): string {
    return (membership.user.githubName || membership.user.username || '').toLowerCase();
  }

  get sortedMemberships(): TeamMembershipModel[] {
    const memberships = this.args.team.memberships.slice();
    const dir = this.sortDirection === 'asc' ? 1 : -1;

    return memberships.sort((a, b) => {
      let comparison = 0;

      switch (this.sortColumn) {
        case 'member':
          comparison = this.getMemberName(a).localeCompare(this.getMemberName(b));
          break;
        case 'lastSeen': {
          const aTime = a.lastAttemptAt ? a.lastAttemptAt.getTime() : 0;
          const bTime = b.lastAttemptAt ? b.lastAttemptAt.getTime() : 0;
          comparison = aTime - bTime;
          break;
        }
        case 'joined':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'attempts':
          comparison = this.getAttempts(a) - this.getAttempts(b);
          break;
        case 'courses':
          comparison = this.getCourseCount(a) - this.getCourseCount(b);
          break;
      }

      return comparison * dir;
    });
  }

  @action
  handleSortClick(column: SortColumn) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
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
