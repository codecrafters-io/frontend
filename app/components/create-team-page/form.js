import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { escapeExpression } from '@ember/-internals/glimmer';

export default class FeaturesListComponent extends Component {
  @tracked isCreatingTeam = false;
  @tracked newTeamName = '';
  @service router;
  @service store;

  get createTeamButtonIsDisabled() {
    return this.newTeamName.trim().length <= 1;
  }

  get currentTeamsHTML() {
    const buildTeamLink = (team) => `<a href="/teams/${team.id}" target="_blank">${escapeExpression(team.name)}</a>`;

    if (this.args.currentTeams.length === 1) {
      return `You're currently in the ${buildTeamLink(this.args.currentTeams[0])} team.`;
    } else {
      return `You're currently in the following teams: ${this.args.currentTeams.map(buildTeamLink).join(', ')}.`;
    }
  }

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
}
