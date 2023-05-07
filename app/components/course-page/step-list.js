import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later, next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { CourseCompletedItem, CourseStageItem, SetupItem } from 'codecrafters-frontend/lib/step-list';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import fade from 'ember-animated/transitions/fade';

export default class CoursePageContentStepListComponent extends Component {
  @tracked activeItemIndex;
  @tracked activeItemWillBeReplaced;
  @tracked polledRepository;
  @tracked selectedItemIndex = null;
  @service store;
  transition = fade;
  transitionDuration = 200;
  @service visibility;

  constructor() {
    super(...arguments);

    this.activeItemIndex = this.computeActiveIndex();
  }

  get items() {
    let items = [];

    items.push(new SetupItem());

    this.args.course.sortedStages.forEach((courseStage) => {
      items.push(new CourseStageItem(this.args.repository, courseStage));
    });

    if (this.args.repository.allStagesAreComplete) {
      items.push(new CourseCompletedItem());
    }

    return items;
  }

  computeActiveIndex() {
    if (!this.repository.firstSubmissionCreated) {
      return 0;
    }

    let highestCompletedStage = this.repository.highestCompletedStage;

    if (highestCompletedStage) {
      return this.repository.highestCompletedStage.position + 1;
    } else {
      return 1;
    }
  }

  get activeItem() {
    return this.items[this.activeItemIndex];
  }

  get expandedItemIndex() {
    return this.selectedItemIndex === null ? this.activeItemIndex : this.selectedItemIndex;
  }

  @action
  async handleCollapsedSetupItemClick() {
    if (this.activeItemIndex === 0) {
      this.selectedItemIndex = null;
      this.scrollToExpandedItem();
    } else {
      this.updateSelectedItemIndex(0);
    }
  }

  @action
  async handleCollapsedStageItemClick(itemIndex) {
    if (itemIndex === this.activeItemIndex) {
      this.selectedItemIndex = null;
      this.scrollToExpandedItem();
    } else {
      this.updateSelectedItemIndex(itemIndex);
    }
  }

  @action
  async handleCollapsedCourseCompletedItemClick() {
    if (this.activeItemIndex === this.items.length - 1) {
      this.selectedItemIndex = null;
      this.scrollToExpandedItem();
    } else {
      this.updateSelectedItemIndex(this.items.length - 1);
    }
  }

  @action
  async handleDidInsert(element) {
    this.stepListElement = element;
    this.startRepositoryPoller();
  }

  @action
  async handleDidInsertPolledRepositoryMismatchLoader() {
    this.updateActiveItemIndex(this.computeActiveIndex());
    this.startRepositoryPoller();
  }

  @action
  async handlePoll() {
    if (this.isViewingNonActiveItem) {
      return;
    }

    let newActiveItemIndex = this.computeActiveIndex();

    if (newActiveItemIndex === this.activeItemIndex) {
      return;
    }

    if (!this.activeItem.shouldAdvanceToNextItemAutomatically) {
      this.selectedItemIndex = this.activeItemIndex;
      this.updateActiveItemIndex(newActiveItemIndex);

      return;
    }

    this.activeItemWillBeReplaced = true;

    later(
      this,
      () => {
        this.activeItemWillBeReplaced = false;
        this.updateActiveItemIndex(newActiveItemIndex);
      },
      2000
    );
  }

  @action
  async handleViewNextStageButtonClick() {
    this.selectedItemIndex = null;
    this.updateActiveItemIndex(this.computeActiveIndex());
  }

  @action
  async handleWillDestroy() {
    this.stopRepositoryPoller();
  }

  get isViewingNonActiveItem() {
    return this.selectedItemIndex && this.selectedItemIndex !== this.activeItemIndex;
  }

  get polledRepositoryNeedsToBeUpdated() {
    return this.polledRepository && this.polledRepository !== this.repository;
  }

  get repository() {
    return this.args.repository;
  }

  scrollToExpandedItem() {
    next(() => {
      const expandedItem = this.stepListElement.querySelector('[data-test-expanded-item]');
      expandedItem.scrollIntoView({ behavior: 'smooth' });
    });
  }

  startRepositoryPoller() {
    this.stopRepositoryPoller();

    if (this.repository) {
      this.repositoryPoller = new RepositoryPoller({ store: this.store, visibilityService: this.visibility, intervalMilliseconds: 2000 });
      this.repositoryPoller.start(this.repository, this.handlePoll);
      this.polledRepository = this.repository;
    }
  }

  stopRepositoryPoller() {
    if (this.repositoryPoller) {
      this.repositoryPoller.stop();
    }

    this.polledRepository = null;
  }

  updateActiveItemIndex(newActiveItemIndex) {
    if (newActiveItemIndex === this.activeItemIndex) {
      return;
    }

    this.activeItemIndex = newActiveItemIndex;

    if (this.activeItemIndex === this.expandedItemIndex) {
      this.scrollToExpandedItem();
    }
  }

  updateSelectedItemIndex(newSelectedItemIndex) {
    if (newSelectedItemIndex === this.selectedItemIndex) {
      return;
    }

    this.selectedItemIndex = newSelectedItemIndex;

    if (this.selectedItemIndex === this.expandedItemIndex) {
      this.scrollToExpandedItem();
    }
  }
}
