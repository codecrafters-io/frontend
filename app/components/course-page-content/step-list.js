import Component from '@glimmer/component';

export default class CoursePageContentStepListComponent extends Component {
  get activeItem() {
    return this.courseStageItems;
  }

  get pendingCourseStages() {
    return this.args.course.sortedStages;
  }
}
