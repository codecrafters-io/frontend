import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    helpText: string;
    icon: string;
    title: string;
  };
}

export default class ReferralLinkStatContainerComponent extends Component<Signature> {
  @service authenticator!: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ReferralLinkStatContainer: typeof ReferralLinkStatContainerComponent;
  }
}
