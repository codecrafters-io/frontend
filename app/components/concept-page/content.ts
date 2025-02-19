import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import ConceptEngagementModel from 'codecrafters-frontend/models/concept-engagement';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import ConceptModel from 'codecrafters-frontend/models/concept';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import type ConfettiService from 'codecrafters-frontend/services/confetti';

interface Signature {
  Args: {
    allConcepts: ConceptModel[];
    concept: ConceptModel;
    conceptGroup?: ConceptGroupModel;
    latestConceptEngagement: ConceptEngagementModel;
    onEngagementCreate?: (engagement: ConceptEngagementModel) => Promise<void>;
  };
}

export default class ContentComponent extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare authenticator: AuthenticatorService;
  @service declare confetti: ConfettiService;
  @service declare store: Store;

  get currentProgressPercentage() {
    return this.args.latestConceptEngagement?.currentProgressPercentage ?? 0;
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
  handleDidInsertConfettiEmoji(emojiElement: HTMLElement) {
    this.confetti.fireFromElement(emojiElement);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptPage::Content': typeof ContentComponent;
  }
}
