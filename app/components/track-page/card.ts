import Component from '@glimmer/component';
import UserModel from 'codecrafters-frontend/models/user';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    logoImageAltText: string;
    logoImageUrl: string;
    isNavigatingToOtherPage?: boolean;
    recentParticipants: UserModel[];
    title: string;
    isComplete: boolean;
  };

  Blocks: {
    default: [];
    afterTitle?: [];
  };
};

export default class TrackPageCardComponent extends Component<Signature> {
  get titleForDisplay() {
    if (this.args.isNavigatingToOtherPage) {
      return `${this.args.title} →`;
    } else {
      return this.args.title;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::Card': typeof TrackPageCardComponent;
  }
}
