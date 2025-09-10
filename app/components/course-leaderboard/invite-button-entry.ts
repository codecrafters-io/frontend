import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    isCollapsed: boolean;
    text: string;
  };
}

export default class CourseLeaderboardInviteButtonEntry extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseLeaderboard::InviteButtonEntry': typeof CourseLeaderboardInviteButtonEntry;
  }
}
