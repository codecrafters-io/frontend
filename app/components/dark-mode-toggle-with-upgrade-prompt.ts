import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';

export interface Signature {
  Element: Element;

  Args: {
    size?: 'regular' | 'small';
    onUpgradePromptOpen?: () => void;
  };
}

export default class DarkModeToggleWithUpgradePromptComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare darkMode: DarkModeService;

  @tracked shouldShowUpgradePrompt = false;

  get userCanAccessMembershipBenefits() {
    return this.authenticator.currentUser && this.authenticator.currentUser.canAccessMembershipBenefits;
  }

  @action
  handleDarkModeToggleClick() {
    if (!this.userCanAccessMembershipBenefits) {
      this.shouldShowUpgradePrompt = true;
      this.darkMode.isEnabledTemporarily = true;
      this.args.onUpgradePromptOpen?.();
    }
  }

  @action
  handleUpgradeModalClose() {
    this.shouldShowUpgradePrompt = false;
    this.darkMode.isEnabledTemporarily = false;
  }

  @action
  handleWillDestroyUpgradeModal() {
    this.darkMode.isEnabledTemporarily = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DarkModeToggleWithUpgradePrompt: typeof DarkModeToggleWithUpgradePromptComponent;
  }
}
