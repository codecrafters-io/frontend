import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';

export default class CoursePageStepListStageItemFirstStageHintComponent extends Component {
  @service store;
  @service visibility;
  transition = fade;

  get readmeURL() {
    return this.args.repository.readmeUrl || this.args.repository.defaultReadmeUrl;
  }

  get shouldPulse() {
    return this.args.courseStage.shouldShowPulsingViewSolutionButtonFor(this.args.repository);
  }

  get solutionIsAvailable() {
    return !!this.solution;
  }

  get solution() {
    if (this.args.repository.language) {
      return this.args.courseStage.solutions.findBy('language', this.args.repository.language);
    } else {
      return this.args.courseStage.solutions.firstObject;
    }
  }
}
