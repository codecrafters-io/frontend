import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import ConceptModel from 'codecrafters-frontend/models/concept';
import type ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

type Signature = {
  Args: {
    concept: ConceptModel;
    conceptGroup: ConceptGroupModel;
  };

  Element: HTMLDivElement;
};

export default class ConceptCompletedModal extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  @action
  handleClicked() {
    this.authenticator.initiateLogin(this.redirectPathAfterLogin);
  }

  get getAccessToMessage() {
    if (this.args.conceptGroup?.title) {
      return `the rest of ${this.args.conceptGroup.title}`;
    }

    return 'all CodeCrafters concepts';
  }

  get redirectPathAfterLogin() {
    if (this.args.conceptGroup?.title) {
      return `/collections/${this.args.conceptGroup.slug}`;
    }

    return '/catalog';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptPage::ConceptCompletedModal': typeof ConceptCompletedModal;
  }
}
