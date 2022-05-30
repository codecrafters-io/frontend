import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CoursePageStepListCourseStageItemMoreDropdownComponent extends Component {
  @service('router') router;

  @action
  handleViewSolutionLinkClicked() {
    if (this.viewSolutionLinkIsEnabled) {
      this.router.transitionTo('course-stage-solution.index', this.args.courseStage.course.slug, this.args.courseStage.slug);
    }
  }

  get viewSolutionLinkIsEnabled() {
    return this.solutionIsAvailable;
  }

  get solutionIsAvailable() {
    return !!this.args.courseStage.solutions.findBy('language', this.args.repository.language);
  }
}
