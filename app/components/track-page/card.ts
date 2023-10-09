import Component from '@glimmer/component';
import UserModel from 'codecrafters-frontend/models/user';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    isNavigatingToOtherPage?: boolean;
    recentParticipants: UserModel[];
    title: string;
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
