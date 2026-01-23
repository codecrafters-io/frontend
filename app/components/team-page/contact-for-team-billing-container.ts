import Component from '@glimmer/component';
import type TeamModel from 'codecrafters-frontend/models/team';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    team: TeamModel;
  };
}

export default class TeamPageContactForTeamBillingContainer extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPage::ContactForTeamBillingContainer': typeof TeamPageContactForTeamBillingContainer;
  }
}
