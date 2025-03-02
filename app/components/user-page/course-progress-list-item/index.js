import Component from '@glimmer/component';
import arrayToSentence from 'array-to-sentence';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

const MAX_LANGUAGES_TO_DISPLAY = 5;

export default class CourseProgressListItemComponent extends Component {
  @service router;

  get completedAt() {
    return this.hasCompletedCourseUsingAnyLanguage ? this.completedCourseParticipations[0].completedAt : null;
  }

  get completedCourseParticipations() {
    return this.args.courseParticipations.filterBy('isCompleted');
  }

  get completedStagesCount() {
    return Math.max(...this.args.courseParticipations.mapBy('completedStageSlugs').map((stage_list) => stage_list.length));
  }

  get course() {
    return this.args.courseParticipations[0].course;
  }

  get hasCompletedCourseUsingAnyLanguage() {
    return this.completedCourseParticipations[0];
  }

  get languagesText() {
    if (this.hasCompletedCourseUsingAnyLanguage) {
      return `using ${arrayToSentence(this.completedCourseParticipations.mapBy('language.name').uniq())}`;
    } else {
      return `using ${arrayToSentence(this.args.courseParticipations.mapBy('language.name').uniq())}`;
    }
  }

  @action

  navigateToCourse() {
    this.router.transitionTo('course-overview', this.course.slug);
  }
  
  get languagesToDisplay() {
    const completedParticipations = this.completedCourseParticipations.sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    const incompleteParticipations = this.args.courseParticipations
      .filter(p => !p.isCompleted)
      .sort((a, b) => new Date(b.lastSubmissionAt).getTime() - new Date(a.lastSubmissionAt).getTime());

    if (completedParticipations.length >= MAX_LANGUAGES_TO_DISPLAY) {
      return completedParticipations.slice(0, MAX_LANGUAGES_TO_DISPLAY);
    }

    return [
      ...completedParticipations,
      ...incompleteParticipations.slice(0, MAX_LANGUAGES_TO_DISPLAY - completedParticipations.length)
    ];
  }

}
