import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

export default class TeamPageMembersListItemComponent extends Component {
  @service store;
  @tracked isRemoving;

  @action
  async handleRemoveButtonClick(teamMembership) {
    this.isRemoving = true;
    await teamMembership.destroyRecord();
    this.isRemoving = false;
  }
}
