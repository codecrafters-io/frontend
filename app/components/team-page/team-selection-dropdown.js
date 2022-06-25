import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TeamPageTeamSelectionDropdownComponent extends Component {
  @service router;

  @action
  async handleTeamLinkClick(team, dropdownActions) {
    dropdownActions.close();
    this.router.transitionTo('team', team.id);
  }
}
