import Component from '@glimmer/component';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';

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

  constructor() {
    super(...arguments);

    this.items = A(this.buildItems());
    this.activeItemIndex = 0;
  }

  buildItems() {
    let items = [];

    items.push(new SetupItem());

    this.args.course.sortedStages.forEach((courseStage) => {
      items.push(new CourseStageItem(courseStage));
    });

    return items;
  }

  @action
  async handleItemCompleted() {
    this.activeItemWillBeReplaced = true;

    later(
      this,
      () => {
        this.activeItemIndex += 1;
        this.activeItemWillBeReplaced = false;
      },
      1000
    );
  }
}
