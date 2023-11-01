import Component from '@glimmer/component';
import { TrackedSet } from 'tracked-built-ins';
import { action } from '@ember/object';

// @ts-ignore
import { cached } from '@glimmer/tracking';

import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import ConceptModel from 'codecrafters-frontend/models/concept';
import type { Block } from 'codecrafters-frontend/models/concept';
import {
  ConceptQuestionBlock,
  IsClickToContinueBlock,
  IsConceptAnimationBlock,
  IsConceptQuestionBlock,
  IsMarkdownBlock,
} from 'codecrafters-frontend/lib/blocks';

interface Signature {
  Args: {
    concept: ConceptModel;
    onProgressPercentageChange: (percentage: number) => void;
  };

  Element: HTMLElement;
}

interface BlockGroup {
  index: number;
  blocks: Block[];
}

export default class ConceptComponent extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

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
    }
  }

  @cached
  get allBlockGroups(): BlockGroup[] {
    return this.allBlocks.reduce((groups, block) => {
      if (groups.length <= 0) {
        groups.push({ index: 0, blocks: [] });
      }

      if (IsClickToContinueBlock(block)) {
        (groups[groups.length - 1] as BlockGroup).blocks.push(block);
      }

      if (IsConceptAnimationBlock(block)) {
        (groups[groups.length - 1] as BlockGroup).blocks.push(block);
      }

      if (IsConceptQuestionBlock(block)) {
        (groups[groups.length - 1] as BlockGroup).blocks.push(block);
      }

      if (IsMarkdownBlock(block)) {
        (groups[groups.length - 1] as BlockGroup).blocks.push(block);
      }

      if (block.isInteractable || groups.length === 0) {
        groups.push({ index: groups.length, blocks: [] });
      }

      return groups;
    }, [] as BlockGroup[]);
  }

  @cached
  get allBlocks() {
    return this.args.concept.parsedBlocks;
  }

  get completedBlocksCount() {
    return this.allBlockGroups.reduce((count, blockGroup) => {
      if (blockGroup.index < this.currentBlockGroupIndex) {
        count += blockGroup.blocks.length;
      }

      return count;
    }, 0);
  }

  get currentBlockGroupIndex() {
    return this.lastRevealedBlockGroupIndex || 0;
  }

  get progressPercentage() {
    if (!this.lastRevealedBlockGroupIndex) {
      return 0; // The user hasn't interacted with any blocks yet
    }

    if (this.hasFinished) {
      return 100;
    } else {
      return Math.round(100 * (this.completedBlocksCount / this.allBlocks.length));
    }
  }

  get visibleBlockGroups() {
    return this.allBlockGroups.slice(0, (this.lastRevealedBlockGroupIndex || 0) + 1);
  }

  @action
  advanceToNextBlockGroup() {
    if (this.currentBlockGroupIndex === this.allBlockGroups.length - 1) {
      this.hasFinished = true;
    } else {
      this.updateLastRevealedBlockGroupIndex(this.currentBlockGroupIndex + 1);
    }

    this.analyticsEventTracker.track('progressed_through_concept', {
      concept_id: this.args.concept.id,
      progress_percentage: this.progressPercentage,
    });
  }

  @action
  handleBackspaceKeydown(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.returnToPreviousBlockGroup();
    }
  }

  @action
  handleBlockGroupContainerInserted(blockGroup: BlockGroup, containerElement: HTMLElement) {
    if (blockGroup.index === this.lastRevealedBlockGroupIndex) {
      containerElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  @action
  handleContinueBlockInsertedAfterQuestion(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  @action
  handleContinueButtonClick() {
    this.advanceToNextBlockGroup();
  }

  @action
  handleDidInsertContainer() {
    this.analyticsEventTracker.track('viewed_concept', { concept_id: this.args.concept.id });
  }

  @action
  handleEnterOrSpaceKeydown(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.advanceToNextBlockGroup();
    }
  }

  @action
  handleQuestionBlockSubmitted(block: ConceptQuestionBlock) {
    this.submittedQuestionSlugs.add(block.conceptQuestionSlug);
  }

  @action
  handleStepBackButtonClick() {
    this.returnToPreviousBlockGroup();
  }

  @action
  returnToPreviousBlockGroup() {
    if (this.currentBlockGroupIndex === 0) {
      return;
    } else {
      (this.allBlockGroups[this.currentBlockGroupIndex] as BlockGroup).blocks.forEach((block) => {
        if (IsConceptQuestionBlock(block)) {
          this.submittedQuestionSlugs.delete(block.conceptQuestionSlug);
        }
      });

      this.updateLastRevealedBlockGroupIndex(this.currentBlockGroupIndex - 1);
    }

    // TODO: Add analytics event?
  }

  updateLastRevealedBlockGroupIndex(newBlockGroupIndex: number) {
    this.lastRevealedBlockGroupIndex = newBlockGroupIndex;
    this.args.onProgressPercentageChange(this.progressPercentage);

    // Temporary hack to allow for deep linking to a specific block group. (Only for admins)
    const urlParams = new URLSearchParams(window.location.search);
    const bgiQueryParam = urlParams.get('bgi');

    if (bgiQueryParam) {
      urlParams.set('bgi', newBlockGroupIndex.toString());
      window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
    }
  }
}
