import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import { action } from '@ember/object';

export default class CoursePageStepListStageItemFirstStageHintComponent extends Component {
  @service featureFlags;
  @service store;
  @service visibility;
  transition = fade;

  @action
  handleClick() {
    if (this.solutionIsAvailable) {
      this.args.onViewSolutionButtonClick();
    } else {
      window.open(this.readmeURL, '_blank');
    }
  }

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
