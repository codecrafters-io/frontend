import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import opacity from 'ember-animated/motions/opacity';

class SetupItem {
  type = 'SetupItem';

  get identifier() {
    return 'setup';
  }
}

class CourseStageItem {
  @tracked courseStage;

  type = 'CourseStageItem';

  constructor(courseStage) {
    this.courseStage = courseStage;
  }

  get identifier() {
    return this.courseStage.id;
  }
}

class CourseCompletedItem {
  type = 'CourseCompletedItem';

  get identifier() {
    return 'completed';
  }
}

export default class CoursePageContentStepListComponent extends Component {
  @tracked activeItemIndex;
  @tracked activeItemWillBeReplaced;
  @tracked polledRepository;
  @tracked selectedItemIndex = null;
  @service store;
  @service visibility;

  constructor() {
    super(...arguments);

    this.activeItemIndex = this.computeActiveIndex();
  }

  get items() {
    let items = [];

    items.push(new SetupItem());

    this.args.course.sortedStages.forEach((courseStage) => {
      items.push(new CourseStageItem(courseStage));
    });

    if (this.args.repository.allStagesAreComplete) {
      items.push(new CourseCompletedItem());
    }

    return items;
  }

  computeActiveIndex() {
    if (!this.repository.firstSubmissionCreated) {
      return 0;
    } else if (this.repository.highestCompletedStage && this.repository.highestCompletedStage.get('id')) {
      return this.repository.highestCompletedStage.get('position') + 1;
    } else {
      return 1;
    }
  }

  get expandedItemIndex() {
    return this.selectedItemIndex === null ? this.activeItemIndex : this.selectedItemIndex;
  }

  @action
  async handleCollapsedSetupItemClick() {
    if (this.activeItemIndex === 0) {
      this.selectedItemIndex = null;
    } else {
      this.selectedItemIndex = 0;
    }
  }

  @action
  async handleCollapsedStageItemClick(itemIndex) {
    if (itemIndex === this.activeItemIndex) {
      this.selectedItemIndex = null;
    } else {
      this.selectedItemIndex = itemIndex;
    }
  }

  @action
  async handleCollapsedCourseCompletedItemClick() {
    if (this.activeItemIndex === this.items.length - 1) {
      this.selectedItemIndex = null;
    } else {
      this.selectedItemIndex = this.items.length - 1;
    }
  }

  @action
  async handleDidInsert() {
    this.startRepositoryPoller();
  }

  @action
  async handleDidInsertPolledRepositoryMismatchLoader() {
    this.activeItemIndex = this.computeActiveIndex();
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

    this.activeItemWillBeReplaced = true;

    later(
      this,
      () => {
        this.activeItemWillBeReplaced = false;
        this.activeItemIndex = newActiveItemIndex;
      },
      2000
    );
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

  get shouldSuppressUpgradePrompts() {
    return this.repository.user.hasActiveSubscription || this.repository.course.releaseStatusIsBeta;
  }

  get shouldShowUpgradePromptForPendingPaidStages() {
    // TODO: Remove the isAdmin restriction
    return this.repository.user.freeUsageRestrictionIsActive && !this.shouldSuppressUpgradePrompts && this.repository.user.isAdmin;
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

  // eslint-disable-next-line require-yield
  *transition({ removedSprites, insertedSprites, keptSprites, duration }) {
    removedSprites.map((s) => {
      if (s.revealed) {
        opacity(s, {
          to: 0,
          duration: duration / 2,
        });
      }
    });

    insertedSprites.concat(keptSprites).map((s) =>
      opacity(s, {
        to: 1,
        duration: duration,
      })
    );
  }
}
