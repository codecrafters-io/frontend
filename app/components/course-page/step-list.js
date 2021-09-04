import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';

export default class CoursePageContentStepListComponent extends Component {
  @tracked activeItem;

  get allItems() {
    return [this.setupItem].concat(this.courseStageItems);
  }

  get courseStageItems() {
    return this.args.course.sortedStages.map((courseStage) => {
      return {
        type: 'CourseStage',
        model: courseStage,
      };
    });
  }

  @action
  async handleDidInsert() {
    this.activeItem = this.setupItem;
  }

  @action
  async handleItemCompleted() {
    console.log('handleItemCompleted');
    later(
      this,
      () => {
        this.activeItem = this.courseStageItems.firstObject;
      },
      5000
    );
  }

  get nextItems() {
    return [];
  }

  get previousItems() {
    return [];
  }

  get setupItem() {
    return { type: 'Setup' };
  }
}
