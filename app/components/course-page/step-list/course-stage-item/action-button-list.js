import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';

export default class CourseStageItemActionButtonListComponent extends Component {
  @service('current-user') currentUserService;
  @service store;
  @service visibility;
  transition = fade;

  get anyButtonIsVisible() {
    return (
      this.shouldShowViewSolutionButton ||
      this.shouldShowViewTestCasesButton ||
      this.shouldShowViewSourceWalkthroughButton ||
      this.shouldShowSubmitFeedbackButton ||
      this.shouldShowEditFeedbackButton ||
      this.shouldShowViewCommentsButton
    );
  }

  @action
  handleViewTestCasesButtonClicked() {
    window.open(this.args.courseStage.testerSourceCodeUrl, '_blank').focus();
  }

  get shouldShowEditFeedbackButton() {
    return !this.args.shouldHideFeedbackButtons && !!this.args.repository.hasClosedCourseStageFeedbackSubmissionFor(this.args.courseStage);
  }

  get shouldShowSubmitFeedbackButton() {
    return (
      !this.args.shouldHideFeedbackButtons &&
      !this.shouldShowEditFeedbackButton &&
      (this.args.repository.stageIsComplete(this.args.courseStage) || this.args.repository.activeStage === this.args.courseStage)
    );
  }

  get shouldShowViewCommentsButton() {
    return true; // Comments are always available
  }

  get shouldShowViewSolutionButton() {
    return true; // Community solutions are always available!
  }

  get shouldShowViewTestCasesButton() {
    return this.args.courseStage.testerSourceCodeUrl;
  }

  get shouldShowViewSourceWalkthroughButton() {
    return this.args.courseStage.sourceWalkthrough;
  }
}
