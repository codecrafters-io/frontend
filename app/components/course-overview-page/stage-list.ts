import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import fade from 'ember-animated/transitions/fade';
import { fadeIn } from 'ember-animated/motions/opacity';
import { tracked } from '@glimmer/tracking';

type Signature = {
  Args: {
    course: CourseModel;
  };
};

export default class CourseOverviewPageStageListItemComponent extends Component<Signature> {
  @tracked shouldShowAllStages = false;
  transition = fade;

  get allStages() {
    return [...this.args.course.sortedBaseStages, ...this.args.course.sortedExtensionStages];
  }

  get visibleStages() {
    if (this.shouldShowAllStages) {
      return this.allStages;
    } else {
      return this.allStages.slice(0, 2);
    }
  }

  // @ts-ignore
  // eslint-disable-next-line require-yield
  *listTransition({ insertedSprites }) {
    // @ts-ignore
    for (const sprite of insertedSprites) {
      fadeIn(sprite);
    }
  }
}
