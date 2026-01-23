import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import escapeHtml from 'escape-html';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import type TeamModel from 'codecrafters-frontend/models/team';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentTeams: TeamModel[];
  };
}

export default class CreateTeamPageForm extends Component<Signature> {
  @tracked isCreatingTeam = false;
  @tracked newTeamName = '';
  @service declare router: RouterService;
  @service declare store: Store;

  get createTeamButtonIsDisabled() {
    return this.newTeamName.trim().length <= 1;
  }

  get currentTeamsHTML() {
    const buildTeamLink = (team: TeamModel) => `<a href="/teams/${team.id}" target="_blank">${escapeHtml(team.name)}</a>`;

    if (this.args.currentTeams.length === 1) {
      return `You're currently in the ${buildTeamLink(this.args.currentTeams[0]!)} team.`;
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CreateTeamPage::Form': typeof CreateTeamPageForm;
  }
}
