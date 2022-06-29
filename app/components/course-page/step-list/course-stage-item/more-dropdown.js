import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CoursePageStepListCourseStageItemMoreDropdownComponent extends Component {
  @service currentUser;
  @service router;

  get currentUserCanAccessSolution() {
    if (this.solutionIsOnlyAccessibleToSubscribers) {
      return this.currentUser.record.hasActiveSubscription || this.currentUser.record.isTeamMember;
    } else {
      return true;
    }
  }

  @action
  handleViewSolutionLinkClicked(dropdownActions) {
    dropdownActions.close();

    if (this.viewSolutionLinkIsEnabled) {
      if (this.currentUserCanAccessSolution) {
        this.args.onViewSolutionButtonClick(this.args.courseStage);
      } else {
        this.router.transitionTo('pay');
      }
    }
  }

  get viewSolutionLinkIsEnabled() {
    return this.solutionIsAvailable;
  }

  get solutionIsOnlyAccessibleToSubscribers() {
    return this.args.courseStage.position >= 4;
  }

  get solutionIsAvailable() {
    return !!this.args.courseStage.solutions.firstObject; // Any language is fine
  }
}
