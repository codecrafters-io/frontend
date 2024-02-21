import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';

export default class ActionButtonListComponent extends Component {
  @service featureFlags;
  @service router;
  transition = fade;

  get anyButtonIsVisible() {
    return (
      this.shouldShowCodeExamplesButton ||
      this.shouldShowViewTestCasesButton ||
      this.shouldShowSubmitFeedbackButton ||
      this.shouldShowEditFeedbackButton
    );
  }

  get shouldShowCodeExamplesButton() {
    return !this.args.courseStage.isFirst;
  }

  get shouldShowEditFeedbackButton() {
    return !this.args.shouldHideFeedbackButtons && !!this.args.repository.hasClosedCourseStageFeedbackSubmissionFor(this.args.courseStage);
  }

  get shouldShowSubmitFeedbackButton() {
    // Hide if we're asked to hide feedback
    if (this.args.shouldHideFeedbackButtons) {
      return false;
    }

    // Hide if edit feedback button is visible
    if (this.shouldShowEditFeedbackButton) {
      return false;
    }

    if (this.args.repository.stageIsComplete(this.args.courseStage) && !this.args.courseStage.isFirst) {
      return true; // Always show feedback button if stage is complete (except stage 1)
    }

    // Show when stage is active except for stage 1 & 2
    return !this.args.courseStage.isFirst && !this.args.courseStage.isSecond && this.args.repository.currentStage === this.args.courseStage;
  }

  get shouldShowViewScreencastsButton() {
    return this.args.courseStage.hasScreencasts;
  }

  get shouldShowViewTestCasesButton() {
    if (this.args.courseStage.isFirst || this.args.courseStage.isSecond) {
      return false; // Don't expose user to too many features at once
    }

    return this.args.courseStage.testerSourceCodeUrl;
  }

  @action
  handleViewCodeExamplesButtonClicked() {
    this.router.transitionTo('course.stage.code-examples', this.args.courseStage.position);
  }

  @action
  handleViewScreencastsButtonClicked() {
    this.router.transitionTo('course.stage.screencasts', this.args.courseStage.position);
  }

  @action
  handleViewTestCasesButtonClicked() {
    window.open(this.args.courseStage.testerSourceCodeUrl, '_blank').focus();
  }
}
