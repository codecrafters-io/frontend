import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';
import RouterService from '@ember/routing/router-service';
import * as Sentry from '@sentry/ember';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type UserModel from 'codecrafters-frontend/models/user';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose?: () => void;
  };
}

export default class DeleteAccountModal extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  @tracked accountDeletionErrorMessage: string | null = null;
  @tracked isDeletingAccount = false;

  rippleSpinnerImage = rippleSpinnerImage;

  get currentUser() {
    return this.authenticator.currentUser as UserModel; // User should be authed to access this page
  }

  @action
  async deleteAccount() {
    if (this.isDeletingAccount) {
      return;
    }

    try {
      this.isDeletingAccount = true;
      this.accountDeletionErrorMessage = null;

      await this.currentUser.destroyRecord();

      this.router.transitionTo('account-deleted');
      this.authenticator.logout();
    } catch (error) {
      this.isDeletingAccount = false;
      this.accountDeletionErrorMessage = 'Failed to delete account, please try again? Contact us at hello@codecrafters.io if this error persists.';
      Sentry.captureException(error);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::DeleteAccountModal': typeof DeleteAccountModal;
  }
}
