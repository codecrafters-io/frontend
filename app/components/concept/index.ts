import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import ConceptEngagementModel from 'codecrafters-frontend/models/concept-engagement';
import ConceptModel from 'codecrafters-frontend/models/concept';
import config from 'codecrafters-frontend/config/environment';
import type { BlockGroup } from 'codecrafters-frontend/models/concept';
import { ConceptQuestionBlock } from 'codecrafters-frontend/utils/blocks';
import { TrackedSet } from 'tracked-built-ins';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import { task } from 'ember-concurrency';
import type Store from 'ember-data/store';

interface Signature {
  Args: {
    concept: ConceptModel;
    latestConceptEngagement: ConceptEngagementModel;
    onEngagementCreate?: (engagement: ConceptEngagementModel) => Promise<void>;
  };

  Element: HTMLDivElement;
}

export default class ConceptComponent extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  @tracked containerElement: HTMLElement | null = null;
  @tracked lastRevealedBlockGroupIndex: number | null = null;
  @tracked submittedQuestionSlugs = new TrackedSet([] as string[]);
  @tracked hasFinished = false;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    // Temporary hack to allow for deep linking to a specific block group. (Only for admins)
    const urlParams = new URLSearchParams(window.location.search);
    const bgiQueryParam = urlParams.get('bgi');

    if (bgiQueryParam) {
      this.lastRevealedBlockGroupIndex = parseInt(bgiQueryParam);
    } else {
      const progressPercentage = this.args.latestConceptEngagement?.currentProgressPercentage ?? 0;
      const completedBlocksCount = Math.round((progressPercentage / 100) * this.allBlocks.length);
      const blockGroupIndex = this.findCurrentBlockGroupIndex(completedBlocksCount);
      this.lastRevealedBlockGroupIndex = blockGroupIndex;
    }
  }

  get allBlockGroups(): BlockGroup[] {
    return this.args.concept.blockGroups;
  }

  get allBlocks() {
    return this.args.concept.parsedBlocks;
  }

  get completedBlockGroups() {
    return this.allBlockGroups.slice(0, this.currentBlockGroupIndex);
  }

  get completedBlocksCount() {
    return this.completedBlockGroups.map((blockGroup) => blockGroup.blocks.length).reduce((a, b) => a + b, 0);
  }

  get computedProgressPercentage() {
    if (!this.lastRevealedBlockGroupIndex) {
      return 0; // The user hasn't interacted with any blocks yet
    }

    if (this.hasFinished) {
      return 100;
    } else {
      return Math.round(100 * (this.completedBlocksCount / this.allBlocks.length));
    }
  }

  get currentBlockGroupIndex() {
    return this.lastRevealedBlockGroupIndex || 0;
  }

  get visibleBlockGroups() {
    return this.allBlockGroups.slice(0, (this.lastRevealedBlockGroupIndex || 0) + 1);
  }

  findCurrentBlockGroupIndex(completedBlocksCount: number) {
    let traversedBlocksCount = 0;
    let currentBlockGroupIndex = 0;

    for (let i = 0; i < this.allBlockGroups.length; i++) {
      const blockGroup = this.allBlockGroups[i];
      traversedBlocksCount = traversedBlocksCount + blockGroup!.blocks.length;

      if (traversedBlocksCount > completedBlocksCount) {
        currentBlockGroupIndex = i;
        break;
      } else if (traversedBlocksCount === completedBlocksCount) {
        currentBlockGroupIndex = i + 1;
        break;
      }
    }

    return currentBlockGroupIndex;
  }

  enqueueConceptEngagementUpdate = task({ keepLatest: true }, async () => {
    // console.log('Enqueuing concept engagement update');
    // console.log('Latest concept engagement', this.args.latestConceptEngagement);
    // if (!this.args.latestConceptEngagement) {
    //   console.log('Creating new concept engagement');
    //   const newConceptEngagement = this.store.createRecord('concept-engagement', {
    //     concept: this.args.concept,
    //     user: this.authenticator.currentUser,
    //   });
    //   this.args.onEngagementCreate?.(newConceptEngagement);

    //   if (this.authenticator.isAuthenticated) {
    //     await newConceptEngagement.save();
    //   }

    //   // Use the new engagement directly instead of waiting for args to update
    //   newConceptEngagement.currentProgressPercentage = this.computedProgressPercentage;

    //   return;
    // }

    this.args.latestConceptEngagement.currentProgressPercentage = this.computedProgressPercentage;

    if (this.authenticator.isAuthenticated) {
      await this.args.latestConceptEngagement.save();
    }
  });

  @action
  async handleContinueButtonClick() {
    console.log('Handling continue button click');
    console.log('Latest concept engagement', this.args.latestConceptEngagement);

    if (!this.args.latestConceptEngagement) {
      console.log('Creating new concept engagement');
      const newConceptEngagement = this.store.createRecord('concept-engagement', {
        concept: this.args.concept,
        user: this.authenticator.currentUser,
      });

      if (this.authenticator.isAuthenticated) {
        await newConceptEngagement.save();
      }

      // await this.args.onEngagementCreate?.(newConceptEngagement);
      if (this.args.onEngagementCreate) {
        await this.args.onEngagementCreate(newConceptEngagement);
      }

      newConceptEngagement.currentProgressPercentage = this.computedProgressPercentage;

      // Add a check to see if args were updated
      if (!this.args.latestConceptEngagement) {
        console.warn('latestConceptEngagement not updated after creation');

        return;
      }

      return;
    }

    if (this.currentBlockGroupIndex === this.allBlockGroups.length - 1) {
      this.hasFinished = true;
    } else {
      this.updateLastRevealedBlockGroupIndex(this.currentBlockGroupIndex + 1);
    }

    this.enqueueConceptEngagementUpdate.perform();

    this.analyticsEventTracker.track('progressed_through_concept', {
      concept_id: this.args.concept.id,
      progress_percentage: this.computedProgressPercentage,
    });
  }

  @action
  handleDidInsertContainer(containerElement: HTMLElement) {
    this.analyticsEventTracker.track('viewed_concept', { concept_id: this.args.concept.id });
    this.containerElement = containerElement;
  }

  @action
  handleQuestionBlockSubmitted(block: ConceptQuestionBlock) {
    this.submittedQuestionSlugs.add(block.conceptQuestionSlug);
  }

  @action
  async handleStepBackButtonClick() {
    if (this.currentBlockGroupIndex === 0) {
      return;
    } else {
      (this.allBlockGroups[this.currentBlockGroupIndex] as BlockGroup).blocks.forEach((block) => {
        if (block.type === 'concept_question') {
          this.submittedQuestionSlugs.delete((block as ConceptQuestionBlock).conceptQuestionSlug);
        }
      });

      this.updateLastRevealedBlockGroupIndex(this.currentBlockGroupIndex - 1);
      this.enqueueConceptEngagementUpdate.perform();
    }

    // TODO: Add analytics event?
  }

  @action
  handleWillDestroyContainer() {
    if (!this.authenticator.isAuthenticated && config.environment !== 'test') {
      this.args.latestConceptEngagement.deleteRecord();
    }
  }

  updateLastRevealedBlockGroupIndex(newBlockGroupIndex: number) {
    this.lastRevealedBlockGroupIndex = newBlockGroupIndex;

    // Temporary hack to allow for deep linking to a specific block group. (Only for admins)
    const urlParams = new URLSearchParams(window.location.search);
    const bgiQueryParam = urlParams.get('bgi');

    if (bgiQueryParam) {
      urlParams.set('bgi', newBlockGroupIndex.toString());
      window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
    }

    next(() => {
      if (this.containerElement) {
        const lastChildElement = this.containerElement.children[this.containerElement.children.length - 1];

        if (lastChildElement) {
          lastChildElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Concept: typeof ConceptComponent;
  }
}
