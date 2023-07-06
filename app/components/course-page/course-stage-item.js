import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';

export default class CourseStageItemComponent extends Component {
  @service featureFlags;
  @service store;
  @service visibility;
  @tracked manualFeedbackFlowIsActive = false;
  transition = fade;

  get automaticFeedbackFlowIsActive() {
    return (
      this.args.shouldShowFeedbackPromptIfStageIsComplete &&
      this.args.repository.highestCompletedStage === this.args.courseStage &&
      !this.args.repository.hasClosedCourseStageFeedbackSubmissionFor(this.args.courseStage)
    );
  }

  get badgeAwards() {
    return this.args.repository.user.badgeAwards.filter((badgeAward) => {
      return badgeAward.submission.repository.id === this.args.repository.id && badgeAward.submission.courseStage.id === this.args.courseStage.id;
    });
  }

  @action
  handleFeedbackActionButtonClicked() {
    this.manualFeedbackFlowIsActive = true;
  }

  @action
  handleFeedbackPromptClosed() {
    this.manualFeedbackFlowIsActive = false;
  }

  @action
  handleFeedbackSubmitted() {
    if (this.manualFeedbackFlowIsActive) {
      this.manualFeedbackFlowIsActive = false;
    } else {
      this.args.onViewNextStageButtonClick();
    }
  }

  @action
  handleViewTestCasesButtonClicked() {
    window.open(this.args.courseStage.testerSourceCodeUrl, '_blank').focus();
  }

  get isActiveStage() {
    return this.args.repository.activeStage === this.args.courseStage;
  }

  get shouldShowCLIUsageInstructions() {
    return this.args.courseStage.isSecond;
  }

  get shouldShowFirstStageHints() {
    return this.args.courseStage.isFirst;
  }

  get shouldShowUpgradePrompt() {
    return this.isActiveStage && !this.statusIsComplete && !this.args.repository.user.canAttemptCourseStage(this.args.courseStage);
  }

  get shouldShowPublishToGitHubPrompt() {
    return !this.args.repository.githubRepositorySyncConfiguration && this.isActiveStage && !this.statusIsComplete && this.args.courseStage.isThird;
  }

  get status() {
    if (this.args.repository.lastSubmissionIsEvaluating && this.args.repository.lastSubmission.courseStage === this.args.courseStage) {
      return 'evaluating';
    }

    if (this.args.repository.stageIsComplete(this.args.courseStage)) {
      return 'complete';
    }

    if (this.args.repository.lastSubmissionHasFailureStatus && this.args.repository.lastSubmission.courseStage === this.args.courseStage) {
      return 'failed';
    }

    if (this.args.repository.activeStage === this.args.courseStage) {
      return 'waiting';
    } else {
      return 'locked';
    }
  }

  get statusIsComplete() {
    return this.status === 'complete';
  }
}
