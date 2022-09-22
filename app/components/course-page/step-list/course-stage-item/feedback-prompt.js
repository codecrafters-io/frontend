import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';

export default class FeedbackPromptComponent extends Component {
  @service store;
  transition = fade;

  constructor() {
    super(...arguments);

    if (!this.feedbackSubmission) {
      next(() => {
        this.store.createRecord('course-stage-feedback-submission', {
          repository: this.args.repository,
          courseStage: this.args.courseStage,
        });
      });
    }
  }

  @action
  handleAnswerOptionSelected(answerOption) {
    this.feedbackSubmission.selectedAnswer = answerOption;
    this.feedbackSubmission.save();
  }

  get answerOptions() {
    return ['😍', '😃', '😐', '😕', '😭'];
  }

  get feedbackSubmission() {
    return this.args.repository.courseStageFeedbackSubmissionFor(this.args.courseStage);
  }
}
