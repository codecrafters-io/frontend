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
  handleViewSolutionLinkClicked() {
    if (this.viewSolutionLinkIsEnabled) {
      if (this.currentUserCanAccessSolution) {
        this.router.transitionTo('course-stage-solution.index', this.args.courseStage.course.slug, this.args.courseStage.slug, {
          queryParams: { language: this.args.repository.get('language.slug') },
        });
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
