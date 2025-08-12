import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type UserModel from 'codecrafters-frontend/models/user';
import { task } from 'ember-concurrency';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    user: UserModel;
  };
}

export default class AnonymousModeSection extends Component<Signature> {
  @tracked isSaving = false;

  get toggleIsDisabled(): boolean {
    return !this.args.user.canAccessMembershipBenefits;
  }

  @action
  async handleToggle() {
    if (!this.toggleIsDisabled) {
      this.toggleValue.perform();
    }
  }

  toggleValue = task({ keepLatest: true }, async (): Promise<void> => {
    this.isSaving = true;

    try {
      this.args.user.hasAnonymousModeEnabled = !this.args.user.hasAnonymousModeEnabled;
      await this.args.user.save();
    } catch (e) {
      console.error(e);

      // TODO: Handle error state?

      return;
    }

    this.isSaving = false;
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::ProfilePage::AnonymousModeSection': typeof AnonymousModeSection;
  }
}
