import { action } from '@ember/object';
import config from 'codecrafters-frontend/config/environment';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import ConceptModel from 'codecrafters-frontend/models/concept';
import type ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

type Signature = {
  Args: {
    concept: ConceptModel;
    conceptGroup: ConceptGroupModel | undefined;
  };

  Element: HTMLDivElement;
};

export default class ConceptCompletedModal extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get redirectPathAfterLogin() {
    if (this.args.conceptGroup?.title) {
      return `/collections/${this.args.conceptGroup.slug}`;
    }

    return '/catalog';
  }

  @action
  handleSignInButtonClick() {
    // We redirect to `<backend_url>/concepts/:id/mark_as_complete` to ensure the user's progress is saved.
    const markAsCompleteUrl = new URL(`${config.x.backendUrl}/concepts/${this.args.concept.id}/mark_as_complete`);

    markAsCompleteUrl.searchParams.set('redirect_url', `${window.origin}${this.redirectPathAfterLogin}`);

    this.authenticator.initiateLoginAndRedirectTo(markAsCompleteUrl.toString());
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptPage::ConceptCompletedModal': typeof ConceptCompletedModal;
  }
}
