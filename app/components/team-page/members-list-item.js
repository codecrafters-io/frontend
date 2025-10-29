import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import window from 'ember-window-mock';
import Component from '@glimmer/component';

export default class TeamPageMembersListItem extends Component {
  @service authenticator;
  @service router;
  @service store;
  @tracked isRemoving;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get currentUserIsTeamAdmin() {
    return this.args.membership.team.admins.includes(this.currentUser);
  }

  get sortedCourses() {
    return this.args.membership.user.courseParticipations
      .map((item) => item.course)
      .uniq()
      .sortBy('sortPositionForTrack');
  }

  @action
  async handleLeaveTeamButtonClick(teamMembership) {
    if (window.confirm(`Are you sure you want to leave the ${this.args.membership.team.name} team?`)) {
      this.isRemoving = true;
      await teamMembership.destroyRecord();
      this.router.transitionTo('index');
    }
  }

  @action
  async handleRemoveButtonClick(teamMembership) {
    this.isRemoving = true;
    await teamMembership.destroyRecord();
    this.isRemoving = false;
  }
}
