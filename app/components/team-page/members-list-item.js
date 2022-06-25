import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

export default class TeamPageMembersListItemComponent extends Component {
  @service('current-user') currentUserService;
  @service store;
  @tracked isRemoving;

  get currentUserIsTeamAdmin() {
    return this.args.team.admins.includes(this.currentUserService.record);
  }

  @action
  async handleRemoveButtonClick(teamMembership) {
    this.isRemoving = true;
    await teamMembership.destroyRecord();
    this.isRemoving = false;
  }
}
