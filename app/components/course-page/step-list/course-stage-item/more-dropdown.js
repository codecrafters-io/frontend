import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CoursePageStepListCourseStageItemMoreDropdownComponent extends Component {
  @service currentUser;
  @service router;

  get currentUserCanAccessSolutionAndWalkthrough() {
    if (this.solutionIsOnlyAccessibleToSubscribers) {
      return this.currentUser.canAccessSubscriberOnlyContent;
    } else {
      return true;
    }
  }

  @action
  handleViewSourceWalkthroughButtonClicked(dropdownActions) {
    if (this.viewSourceWalkthroughButtonIsEnabled) {
      dropdownActions.close();

      if (this.currentUserCanAccessSolutionAndWalkthrough) {
        this.args.onViewSourceWalkthroughButtonClick();
      } else {
        this.router.transitionTo('pay');
      }
    }
  }

  @action
  handleViewSolutionButtonClicked(dropdownActions) {
    if (this.viewSolutionButtonIsEnabled) {
      dropdownActions.close();

      if (this.currentUserCanAccessSolutionAndWalkthrough) {
        this.args.onViewSolutionButtonClick();
      } else {
        this.router.transitionTo('pay');
      }
    }
  }

  get viewSourceWalkthroughButtonIsEnabled() {
    return this.args.courseStage.hasSourceWalkthrough;
  }

  get viewSolutionButtonIsEnabled() {
    return this.solutionIsAvailable;
  }

  get solutionIsOnlyAccessibleToSubscribers() {
    return this.args.courseStage.position >= 4;
  }

  get solutionIsAvailable() {
    return !!this.args.courseStage.solutions.firstObject; // Any language is fine
  }
}
