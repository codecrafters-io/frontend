import Component from '@glimmer/component';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import fade from 'ember-animated/transitions/fade';

class SetupItem {
  type = 'SetupItem';
}

class CourseStageItem {
  @tracked courseStage;
  type = 'CourseStageItem';

  constructor(courseStage) {
    this.courseStage = courseStage;
  }
}

export default class CoursePageContentStepListComponent extends Component {
  @tracked activeItemIndex;
  @tracked activeItemWillBeReplaced;
  @tracked createdRepository;
  @service store;
  transition = fade;
  @service visibility;

  constructor() {
    super(...arguments);

    this.items = A(this.buildItems());

    this.activeItemIndex = this.computeActiveIndex();
  }

  buildItems() {
    let items = [];

    items.push(new SetupItem());

    this.args.course.sortedStages.forEach((courseStage) => {
      items.push(new CourseStageItem(courseStage));
    });

    return items;
  }

  computeActiveIndex() {
    if (!this.repository) {
      return 0;
    } else {
      return 1; // Implement fetching other stages
    }
  }

  @action
  async handleDidInsert() {
    this.startRepositoryPoller();
  }

  @action
  async handlePoll() {
    let newActiveItemIndex = this.computeActiveIndex();

    if (newActiveItemIndex === this.activeItemIndex) {
      return;
    }

    this.activeItemWillBeReplaced = true;

    later(
      this,
      () => {
        this.activeItemIndex += 1;
        this.activeItemWillBeReplaced = false;
      },
      2000
    );
  }

  @action
  async handleRepositoryCreate(createdRepository) {
    this.createdRepository = createdRepository;
    this.startRepositoryPoller();
  }

  @action
  async handleWillDestroy() {
    this.stopRepositoryPoller();
  }

  get repository() {
    return this.args.repository || this.createdRepository;
  }

  startRepositoryPoller() {
    if (this.repository) {
      this.repositoryPoller = new RepositoryPoller({ store: this.store, visibilityService: this.visibility });
      this.repositoryPoller.start(this.repository, this.handlePoll);
    }
  }

  stopRepositoryPoller() {
    if (this.repositoryPoller) {
      this.repositoryPoller.stop();
    }
  }
}
