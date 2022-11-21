import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import window from 'ember-window-mock';
import Component from '@glimmer/component';

export default class TeamPageMembersListItemComponent extends Component {
  @service('current-user') currentUserService;
  @service router;
  @service store;
  @tracked isRemoving;

  get currentUser() {
    return this.currentUserService.record;
  }

  get currentUserIsTeamAdmin() {
    return this.args.membership.team.admins.includes(this.currentUser);
  }

  @action
  async handleRemoveButtonClick(teamMembership) {
    this.isRemoving = true;
    await teamMembership.destroyRecord();
    this.isRemoving = false;
  }

  @action
  async handleLeaveTeamButtonClick(teamMembership) {
    if (window.confirm(`Are you sure you want to leave the ${this.args.membership.team.name} team?`)) {
      this.isRemoving = true;
      await teamMembership.destroyRecord();
      this.router.transitionTo('index');
    }
  }

  get sortedCompletedCourses() {
    return this.args.membership.user.courseParticipations.filterBy('isCompleted').mapBy('course').uniq().sortBy('sortPositionForTrack');
  }

  get sortedIncompleteCourses() {
    return this.args.membership.user.courseParticipations.rejectBy('isCompleted').mapBy('course').uniq().sortBy('sortPositionForTrack');
  }
}
