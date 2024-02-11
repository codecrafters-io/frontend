import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import ConceptModel from 'codecrafters-frontend/models/concept';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    concept: ConceptModel;
  };
}

export default class ConceptCardComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get latestConceptEngagement() {
    const conceptEngagements = this.authenticator.currentUser?.conceptEngagements.filter(
      (engagement) => engagement.concept.slug === this.args.concept.slug,
    );

    const latestConceptEngagement = conceptEngagements?.sortBy('createdAt').reverse().get('firstObject');

    return latestConceptEngagement;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptsPage::ConceptCard': typeof ConceptCardComponent;
  }
}
