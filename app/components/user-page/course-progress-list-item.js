import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CourseProgressListItemComponent extends Component {
  get course() {
    return this.args.courseParticipationGroup.firstObject.course;
  }

  @action
  navigateToCourse(course) {
    this.router.transitionTo('course-overview', course.slug);
  }
}
