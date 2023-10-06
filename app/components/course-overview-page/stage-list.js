import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import { fadeIn } from 'ember-animated/motions/opacity';
import { tracked } from '@glimmer/tracking';

export default class CourseOverviewPageStageListItemComponent extends Component {
  @tracked shouldShowAllStages = false;
  transition = fade;

  get hiddenStagesCount() {
    return this.args.course.sortedStages.length - 2;
  }

  get visibleStages() {
    if (this.shouldShowAllStages) {
      return this.args.course.sortedStages;
    } else {
      return this.args.course.sortedStages.slice(0, 2);
    }
  }

  // eslint-disable-next-line require-yield
  *listTransition({ insertedSprites }) {
    for (let sprite of insertedSprites) {
      fadeIn(sprite);
    }
  }
}
