import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export interface Signature {
  Element: Element;

  Args: {
    size?: 'regular' | 'small';
    onUpgradePromptOpen?: () => void;
  };
}

export default class DarkModeToggleWithUpgradePromptComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  @tracked shouldShowUpgradePrompt = false;

  get userCanAccessMembershipBenefits() {
    return this.authenticator.currentUser && this.authenticator.currentUser.canAccessMembershipBenefits;
  }

  @action
  handleDarkModeToggleClick() {
    if (!this.userCanAccessMembershipBenefits) {
      this.shouldShowUpgradePrompt = true;
      this.args.onUpgradePromptOpen?.();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DarkModeToggleWithUpgradePrompt: typeof DarkModeToggleWithUpgradePromptComponent;
  }
}
