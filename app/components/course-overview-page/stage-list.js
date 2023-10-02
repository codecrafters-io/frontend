import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import { fadeIn } from 'ember-animated/motions/opacity';
import { tracked } from '@glimmer/tracking';

export default class CourseOverviewPageStageListItemComponent extends Component {
  @tracked shouldShowAllStages = false;
  transition = fade;

  get visibleStages() {
    if (this.shouldShowAllStages) {
      return this.args.course.sortedBaseStages;
    } else {
      return this.args.course.sortedBaseStages.slice(0, 2);
    }
  }

  get hiddenStagesCount() {
    return this.args.course.sortedBaseStages.length - 2;
  }

  // eslint-disable-next-line require-yield
  *listTransition({ insertedSprites }) {
    for (let sprite of insertedSprites) {
      fadeIn(sprite);
    }
  }
}
