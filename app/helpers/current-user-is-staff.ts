import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export interface Signature {
  Args: {
    Positional: [];
  };
  Return: boolean;
}

export default class CurrentUserIsStaff extends Helper<Signature> {
  @service declare authenticator: AuthenticatorService;

  public compute(): boolean {
    return !!(this.authenticator.currentUser && this.authenticator.currentUser.isStaff);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'current-user-is-staff': typeof CurrentUserIsStaff;
  }
}
