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
  handleClicked() {
    // We use a backend redirect flow here to handle concept completion after signup.
    // Flow:
    // 1. User clicks "Sign up" on concept completed modal
    // 2. Redirect to backend endpoint that:
    //    - Marks concept as complete (once user is authenticated)
    //    - Redirects user to their final destination
    //
    // This approach ensures we don't lose the completion state during the auth flow,
    // and handles edge cases like browser refresh during signup.
    const markAsCompleteUrl = new URL(`${config.x.backendUrl}/concepts/${this.args.concept.id}/mark_as_complete`);

    markAsCompleteUrl.searchParams.set('redirect_url', this.redirectPathAfterLogin);

    this.authenticator.initiateLogin(markAsCompleteUrl.toString());
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptPage::ConceptCompletedModal': typeof ConceptCompletedModal;
  }
}
