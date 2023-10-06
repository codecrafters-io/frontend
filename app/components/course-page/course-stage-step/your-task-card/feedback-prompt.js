import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
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

  get answerOptions() {
    return ['😍', '😃', '😐', '😕', '😭'];
  }

  get congratulatoryMessage() {
    if (this.args.courseStage.isLast) {
      return 'You did it!';
    } else if (this.args.courseStage.isPenultimate) {
      return 'Just one more to go!';
    }

    return (
      {
        1: 'Congrats!',
        2: 'Nice work!',
        3: 'Great streak!',
        4: 'Keep it up!',
        5: 'Incredible!',
        6: 'Yay!',
        7: 'Good pace!',
        8: 'Nicely done!',
        9: 'Woot!',
      }[this.args.courseStage.position] || 'Nice work!'
    );
  }

  get explanationTextareaPlaceholder() {
    if (['😍', '😃'].includes(this.feedbackSubmission.selectedAnswer)) {
      return `Tell us more!`;
    } else {
      return `What could be better?`;
    }
  }

  get feedbackSubmission() {
    return this.args.repository.courseStageFeedbackSubmissionFor(this.args.courseStage);
  }

  get stageIsComplete() {
    return this.args.repository.stageIsComplete(this.args.courseStage);
  }

  @action
  handleAnswerOptionSelected(answerOption) {
    this.feedbackSubmission.selectedAnswer = answerOption;
    this.feedbackSubmission.save();
  }

  @action
  handleExplanationTextareaBlur() {
    this.feedbackSubmission.save();
  }

  @action
  handleSubmitButtonClick() {
    this.feedbackSubmission.status = 'closed';
    this.args.onSubmit();

    // Wait for animation to complete
    later(
      this,
      () => {
        this.feedbackSubmission.save();
      },
      500,
    );
  }
}
