import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class LeaderboardTeamDropdownComponent extends Component {
  @action
  async handleTeamLinkClick(team, dropdownActions) {
    dropdownActions.close();
    this.args.onChange(team);
  }
}
