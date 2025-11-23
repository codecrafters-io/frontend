import { service } from '@ember/service';
import Component from '@glimmer/component';
import type UserModel from 'codecrafters-frontend/models/user';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    size: 'small' | 'large';
  };
}

export default class VipBadge extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get buttonSize() {
    // arg:small -> PrimaryButton size:extra-small
    // arg:large -> small
    return this.args.size === 'large' ? 'small' : 'extra-small';
  }

  get currentUser() {
    return this.authenticator.currentUser as UserModel;
  }

  get size() {
    // Default to small if not provided
    return this.args.size || 'small';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'BillingStatusBadge::VipBadge': typeof VipBadge;
  }
}
