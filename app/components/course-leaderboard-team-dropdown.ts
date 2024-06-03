import Component from '@glimmer/component';
import TeamModel from 'codecrafters-frontend/models/team';
import { action } from '@ember/object';

type Signature = {
  Element: HTMLDivElement;
  Args: {
    team: TeamModel | null;
    teams: TeamModel[];
    onChange: (team: TeamModel | null) => void;
  };
};

export default class CourseLeaderboardTeamDropdownComponent extends Component<Signature> {
  @action
  async handleTeamLinkClick(team: TeamModel | null, dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.args.onChange(team);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CourseLeaderboardTeamDropdown: typeof CourseLeaderboardTeamDropdownComponent;
  }
}
