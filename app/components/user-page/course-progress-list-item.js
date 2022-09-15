import Component from '@glimmer/component';
import arrayToSentence from 'array-to-sentence';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CourseProgressListItemComponent extends Component {
  @service router;

  get course() {
    return this.args.courseParticipations.firstObject.course;
  }

  get completedAt() {
    return this.hasCompletedCourseUsingAnyLanguage ? this.completedCourseParticipations.firstObject.completedAt : null;
  }

  get completedStagesCount() {
    return Math.max(...this.args.courseParticipations.mapBy('currentStage.position')) - 1;
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
  navigateToCourse() {
    this.router.transitionTo('course-overview', this.course.slug);
  }
}
