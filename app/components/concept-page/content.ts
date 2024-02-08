import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import ConceptModel from 'codecrafters-frontend/models/concept';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  allConcepts: ConceptModel[];
  concept: ConceptModel;
  conceptGroup: ConceptGroupModel;
  nextConcept: ConceptModel | null;
  onProgressPercentageChange: (percentage: number) => void;
}

export default class ContentComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;
  @tracked currentProgressPercentage = this.latestConceptEngagement?.currentProgressPercentage || 0;

  get hasCompletedConcept() {
    return this.currentProgressPercentage === 100;
  }

  get latestConceptEngagement() {
    const conceptEngagements = this.authenticator.currentUser?.conceptEngagements.filter((engagement) => engagement.concept.slug === this.args.concept.slug);
    const latestConceptEngagement = conceptEngagements?.sortBy('createdAt').reverse().get('firstObject');
    // return conceptEngagements?.sortBy('createdAt').reverse().get('firstObject');
    console.log('latestConceptEngagement', latestConceptEngagement);
    return latestConceptEngagement;
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
    this.currentProgressPercentage = 0;
  }

  @action
  async handleProgressPercentageChanged(progressPercentage: number) {
    if (!this.latestConceptEngagement && this.currentProgressPercentage === 0) {
      this.store.createRecord('concept-engagement', { concept: this.args.concept, user: this.authenticator.currentUser, currentProgressPercentage: progressPercentage }).save()
    }

    if (progressPercentage > this.currentProgressPercentage) {
      this.latestConceptEngagement!.currentProgressPercentage = progressPercentage;
      this.latestConceptEngagement!.save();
    }

    this.currentProgressPercentage = progressPercentage;
  }

  @action
  handleUpcomingConceptInserted(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
