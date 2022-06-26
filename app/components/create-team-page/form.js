import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class FeaturesListComponent extends Component {
  @tracked isCreatingTeam = false;
  @tracked newTeamName = '';
  @service router;
  @service store;

  @action
  async handleCreateTeamButtonClick() {
    if (this.createTeamButtonIsDisabled) {
      return;
    }

    this.isCreatingTeam = true;
    const team = await this.store.createRecord('team', { name: this.newTeamName }).save();
    this.isCreatingTeam = false;
    this.router.transitionTo('team', team.id);
  }

  get createTeamButtonIsDisabled() {
    return this.newTeamName.trim().length <= 1;
  }
}
