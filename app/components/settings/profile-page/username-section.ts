import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type UserModel from 'codecrafters-frontend/models/user';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    user: UserModel;
  };
}

export default class UsernameSectionComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  @tracked isSyncingUsernameFromGitHub = false;

  get currentUser() {
    return this.authenticator.currentUser as UserModel;
  }

  @action
  async refreshFromGitHub() {
    if (this.currentUser.hasAnonymousModeEnabled) {
      return
    }

    this.isSyncingUsernameFromGitHub = true;
    await this.currentUser.syncUsernameFromGitHub(null);
    this.isSyncingUsernameFromGitHub = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::ProfilePage::UsernameSection': typeof UsernameSectionComponent;
  }
}
