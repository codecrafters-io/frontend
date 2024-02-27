import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import ConceptEngagementModel from 'codecrafters-frontend/models/concept-engagement';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import ConceptModel from 'codecrafters-frontend/models/concept';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

interface Signature {
  Args: {
    allConcepts: ConceptModel[];
    concept: ConceptModel;
    conceptGroup?: ConceptGroupModel;
    latestConceptEngagement: ConceptEngagementModel;
    nextConcept: ConceptModel | null;
  };
}

export default class ContentComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare store: Store;

  get currentProgressPercentage() {
    return this.args.latestConceptEngagement.currentProgressPercentage;
  }

  get hasCompletedConcept() {
    return this.currentProgressPercentage === 100;
  }

  get nextConcept() {
    return this.args.allConcepts.find((concept) => concept.slug === this.args.conceptGroup?.nextConceptSlug(this.args.concept.slug));
  }

  get remainingBlocksCount() {
    const allBlocks = this.args.concept.parsedBlocks;
    const completedBlocksCount = Math.round((this.currentProgressPercentage / 100) * allBlocks.length);

    return allBlocks.length - completedBlocksCount;
  }

  @action
  handleCopyButtonClick() {
    this.analyticsEventTracker.track('clicked_share_concept_button', {
      concept_id: this.args.concept.id,
    });
  }
}
