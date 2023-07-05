import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class CourseStageItemHeaderComponent extends Component {
  @service featureFlags;

  get shouldShowCompletionPercentage() {
    if (this.args.courseStage.isSecond && this.args.courseStage.course.isRedis) {
      return this.featureFlags.canSeeStage2CompletionRate;
    } else {
      return false; // Only test for stage 2 now
    }
  }
}
