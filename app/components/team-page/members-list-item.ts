import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import window from 'ember-window-mock';
import Component from '@glimmer/component';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import uniqReducer from 'codecrafters-frontend/utils/uniq-reducer';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type TeamMembershipModel from 'codecrafters-frontend/models/team-membership';
import type CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    membership: TeamMembershipModel;
  };
}

export default class TeamPageMembersListItem extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;

  @tracked isRemoving = false;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get currentUserIsTeamAdmin() {
    if (!this.currentUser) {
      return false;
    }

    return this.args.membership.team.admins.includes(this.currentUser);
  }

  get sortedCourses(): CourseModel[] {
    return this.args.membership.user.courseParticipations
      .map((item) => item.course)
      .reduce(uniqReducer<CourseModel>(), [])
      .sort(fieldComparator('sortPositionForTrack'));
  }

  @action
  async handleLeaveTeamButtonClick(teamMembership: TeamMembershipModel) {
    if (window.confirm(`Are you sure you want to leave the ${this.args.membership.team.name} team?`)) {
      this.isRemoving = true;
      await teamMembership.destroyRecord();
      this.router.transitionTo('index');
    }
  }

  @action
  async handleRemoveButtonClick(teamMembership: TeamMembershipModel) {
    this.isRemoving = true;
    await teamMembership.destroyRecord();
    this.isRemoving = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPage::MembersListItem': typeof TeamPageMembersListItem;
  }
}
