import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;
}

export default class HeaderComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  get activeTab() {
    if (this.router.currentRouteName === 'vote.course-extension-ideas') {
      return 'challenge-extensions';
    } else {
      return 'challenges';
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'VotePage::Header': typeof HeaderComponent;
  }
}
