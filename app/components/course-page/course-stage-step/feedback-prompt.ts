import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type Store from '@ember-data/store';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    courseStage: CourseStageModel;
    repository: RepositoryModel;
    onSubmit: () => void;
  };
};

export default class FeedbackPromptComponent extends Component<Signature> {
  @tracked isEditingClosedSubmission = false;
  @service declare store: Store;
  transition = fade;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    if (!this.feedbackSubmission) {
      next(() => {
        this.store.createRecord('course-stage-feedback-submission', {
          repository: this.args.repository,
          courseStage: this.args.courseStage,
        });
      });
    }
  }

  get answerOptionsWithColors(): { answer: string; colorOnHoverAndSelect: 'green' | 'red' }[] {
    return [
      { answer: '😍', colorOnHoverAndSelect: 'green' },
      { answer: '😃', colorOnHoverAndSelect: 'green' },
      { answer: '😐', colorOnHoverAndSelect: 'green' },
      { answer: '😕', colorOnHoverAndSelect: 'red' },
      { answer: '😭', colorOnHoverAndSelect: 'red' },
    ];
  }

  get congratulatoryMessage() {
    // TODO: Fix last & penultimate cases

    // if (this.args.courseStage.isLast) {
    //   return 'You did it!';
    // } else if (this.args.courseStage.isPenultimate) {
    //   return 'Just one more to go!';
    // }

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
    if (['😍', '😃'].includes(this.feedbackSubmission!.selectedAnswer)) {
      return `Tell us more!`;
    } else {
      return `What could be better?`;
    }
  }

  get feedbackSubmission() {
    return this.args.repository.courseStageFeedbackSubmissionFor(this.args.courseStage);
  }

  get submissionIsClosed() {
    return this.feedbackSubmission?.statusIsClosed;
  }

  @action
  handleAnswerOptionSelected(answerOption: string) {
    this.feedbackSubmission!.selectedAnswer = answerOption;
    this.feedbackSubmission!.save();
  }

  @action
  handleExplanationTextareaBlur() {
    this.feedbackSubmission!.save();
  }

  @action
  handleSubmitButtonClick() {
    this.feedbackSubmission!.status = 'closed';

    // Don't fire for editing submissions
    if (!this.isEditingClosedSubmission) {
      this.args.onSubmit();
    }

    this.isEditingClosedSubmission = false;
    this.feedbackSubmission!.save();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::FeedbackPrompt': typeof FeedbackPromptComponent;
  }
}
