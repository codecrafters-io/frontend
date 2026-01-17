import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import ConceptModel from 'codecrafters-frontend/models/concept';
import { service } from '@ember/service';
import config from 'codecrafters-frontend/config/environment';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    concept: ConceptModel;
  };
}

export default class ConceptCard extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get latestConceptEngagement() {
    return this.authenticator.currentUser?.conceptEngagements
      .filter((engagement) => engagement.concept.slug === this.args.concept.slug)
      .sort(fieldComparator('startedAt'))
      .reverse()[0];
  }

  get linkTarget() {
    // Don't open in new tab during tests, as it breaks test navigation
    return config.environment === 'test' ? undefined : '_blank';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptsPage::ConceptCard': typeof ConceptCard;
  }
}
