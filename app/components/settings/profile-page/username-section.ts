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

  @tracked isSyncingGitHubUsername = false;

  @action
  async refreshFromGitHub() {
    this.isSyncingGitHubUsername = true;
    await this.authenticator.currentUser?.syncGitHubUsername(null);
    this.isSyncingGitHubUsername = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::ProfilePage::UsernameSection': typeof UsernameSectionComponent;
  }
}
