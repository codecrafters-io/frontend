import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CoursePageStepListCourseStageItemMoreDropdownComponent extends Component {
  @service currentUser;
  @service router;

  @action
  handleViewSolutionLinkClicked() {
    if (this.viewSolutionLinkIsEnabled) {
      if (this.solutionIsOnlyAccessibleToSubscribers && !this.currentUser.isSubscriber) {
        this.router.transitionTo('pay');
      } else {
        this.router.transitionTo('course-stage-solution.index', this.args.courseStage.course.slug, this.args.courseStage.slug, {
          queryParams: { language: this.args.repository.language.slug },
        });
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
