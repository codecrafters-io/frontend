import Component from '@glimmer/component';
import arrayToSentence from 'array-to-sentence';
import { action } from '@ember/object';

export default class CourseProgressListItemComponent extends Component {
  get course() {
    return this.args.courseParticipations.firstObject.course;
  }

  get completedAt() {
    return this.hasCompletedCourseUsingAnyLanguage ? this.completedCourseParticipations.firstObject.completedAt : null;
  }

  get languagesText() {
    if (this.hasCompletedCourseUsingAnyLanguage) {
      return `using ${arrayToSentence(this.completedCourseParticipations.mapBy('language.name').uniq())}`;
    } else {
      return `using ${arrayToSentence(this.args.courseParticipations.mapBy('language.name').uniq())}`;
    }
  }

  get completedCourseParticipations() {
    return this.args.courseParticipations.filterBy('isCompleted');
  }

  get hasCompletedCourseUsingAnyLanguage() {
    return this.completedCourseParticipations.firstObject;
  }

  @action
  navigateToCourse(course) {
    this.router.transitionTo('course-overview', course.slug);
  }
}
