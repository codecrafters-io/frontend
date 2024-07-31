import Component from '@glimmer/component';
import type UserModel from 'codecrafters-frontend/models/user';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    user: UserModel;
  };
}

export default class TopParticipantAvatarComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::Header::TopParticipantAvatar': typeof TopParticipantAvatarComponent;
  }
}
