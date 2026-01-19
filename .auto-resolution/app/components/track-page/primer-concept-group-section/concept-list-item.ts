import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type ConceptModel from 'codecrafters-frontend/models/concept';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    concept: ConceptModel;
  };
}

export default class ConceptListItem extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get isComplete() {
    if (!this.authenticator.currentUser) {
      return false;
    }

    return this.authenticator.currentUser.conceptEngagements.some(
      (engagement) => engagement.concept.slug === this.args.concept.slug && engagement.isCompleted,
    );
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::PrimerConceptGroupSection::ConceptListItem': typeof ConceptListItem;
  }
}
