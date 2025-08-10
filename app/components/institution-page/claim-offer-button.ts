import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    onClick: () => void;
  };
}

export default class ClaimOfferButton extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get currentUserCanAccessMembershipBenefits(): boolean {
    return !!(this.currentUser && this.currentUser.canAccessMembershipBenefits);
  }

  // TODO(CC-1888): Add other conditions, like unauthenticated user, has previous grant etc.
  get isDisabled() {
    return this.currentUserCanAccessMembershipBenefits;
  }

  @action
  handleClick() {
    if (!this.isDisabled) {
      this.args.onClick();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::ClaimOfferButton': typeof ClaimOfferButton;
  }
}
