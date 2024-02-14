import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import ConceptEngagementModel from 'codecrafters-frontend/models/concept-engagement';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import ConceptModel from 'codecrafters-frontend/models/concept';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
// import { tracked } from '@glimmer/tracking';

interface Signature {
  Args: {
    allConcepts: ConceptModel[];
    concept: ConceptModel;
    conceptEngagement: ConceptEngagementModel;
    conceptGroup?: ConceptGroupModel;
    nextConcept: ConceptModel | null;
  };
}

export default class ContentComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  get currentProgressPercentage() {
    return this.args.conceptEngagement.currentProgressPercentage;
  }

  get hasCompletedConcept() {
    return this.currentProgressPercentage === 100;
  }

  get nextConcept() {
    return this.args.allConcepts.find((concept) => concept.slug === this.args.conceptGroup?.nextConceptSlug(this.args.concept.slug));
  }

  @action
  handleCompletionContainerInserted(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  @action
  handleConceptDidUpdate() {
    // this.currentProgressPercentage = 0;
  }

  @action
  handleUpcomingConceptInserted(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
