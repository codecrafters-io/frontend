import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import fade from 'ember-animated/transitions/fade';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;
}

export default class CommunitySolutionCardFeedbackSectionComponent extends Component<Signature> {
  transition = fade;

  @tracked tempHasVotedRecently = false;
  @tracked tempHasUpvoted = false;
  @tracked tempHasDownvoted = false;

  @action
  handleDownvoteButtonClick() {
    // No feedback if the user is "reversing" their vote
    if (this.tempHasDownvoted) {
      this.tempHasDownvoted = false;
      this.tempHasVotedRecently = false;

      return;
    }

    this.flashSuccessMessageTask.perform();
    this.tempHasUpvoted = false;
    this.tempHasDownvoted = true;
  }

  @action
  handleUpvoteButtonClick() {
    // No feedback if the user is "reversing" their vote
    if (this.tempHasUpvoted) {
      this.tempHasUpvoted = false;
      this.tempHasVotedRecently = false;

      return;
    }

    this.flashSuccessMessageTask.perform();
    this.tempHasDownvoted = false;
    this.tempHasUpvoted = true;
  }

  flashSuccessMessageTask = task({ keepLatest: true }, async () => {
    this.tempHasVotedRecently = true;
    await timeout(1500);
    this.tempHasVotedRecently = false;
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::FeedbackSection': typeof CommunitySolutionCardFeedbackSectionComponent;
  }
}
