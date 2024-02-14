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
    return this.authenticator.currentUser?.conceptEngagements
      .filter((engagement) => engagement.concept.slug === this.args.concept.slug)
      .sortBy('createdAt')
      .reverse()[0];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptsPage::ConceptCard': typeof ConceptCardComponent;
  }
}
