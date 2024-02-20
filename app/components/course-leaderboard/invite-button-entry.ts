import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    isCollapsed: boolean;
    text: string;
  };
}

export default class CourseLeaderboardInviteButtonEntryComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseLeaderboard::InviteButtonEntry': typeof CourseLeaderboardInviteButtonEntryComponent;
  }
}
