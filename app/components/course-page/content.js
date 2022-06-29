import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CoursePageContentComponent extends Component {
  @tracked currentCourseStageForSolution;

  @action
  async handleViewSolutionButtonClick(courseStage) {
    this.currentCourseStageForSolution = courseStage;
  }

  @action
  async handleCourseStageSolutionModalClose() {
    this.currentCourseStageForSolution = null;
  }

  get isViewingCourseStageSolution() {
    return !!this.currentCourseStageForSolution;
  }
}
