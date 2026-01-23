import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type TeamModel from 'codecrafters-frontend/models/team';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    team: TeamModel;
    allTeams: TeamModel[];
  };
}

export default class TeamPageTeamSelectionDropdown extends Component<Signature> {
  @service declare router: RouterService;

  @action
  async handleTeamLinkClick(team: TeamModel, dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.router.transitionTo('team', team.id);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPage::TeamSelectionDropdown': typeof TeamPageTeamSelectionDropdown;
  }
}
