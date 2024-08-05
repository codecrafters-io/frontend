import { service } from '@ember/service';
import Component from '@glimmer/component';
import type UserModel from 'codecrafters-frontend/models/user';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

interface Signature {
  Element: HTMLDivElement;
}

export default class VipBadgeComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser as UserModel;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Header::VipBadge': typeof VipBadgeComponent;
  }
}
