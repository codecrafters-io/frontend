import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import showdown from 'showdown';

export default class CoursePageStepListStageItemComponent extends Component {
  @service store;
  @service visibility;
  transition = fade;

  get instructionsHTML() {
    // TODO: Handle language etc.
    return htmlSafe(new showdown.Converter().makeHtml(this.args.courseStage.descriptionMarkdownTemplate));
  }

  get isComplete() {
    return false; // TODO: Use course completions
  }

  get status() {
    if (this.args.repository.lastSubmissionIsEvaluating && this.args.repository.lastSubmission.courseStage === this.args.courseStage) {
      return 'evaluating';
    }

    if (this.args.repository.highestCompletedStage && this.args.repository.highestCompletedStage.get('position') >= this.args.courseStage.position) {
      return 'complete';
    }

    if (
      this.args.repository.lastSubmissionIsRecent &&
      this.args.repository.lastSubmissionHasFailureStatus &&
      this.args.repository.lastSubmission.courseStage === this.args.courseStage
    ) {
      return 'failed';
    }

    return 'waiting';
  }
}
