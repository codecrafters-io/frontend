import Component from '@glimmer/component';
import arrayToSentence from 'array-to-sentence';
import { action } from '@ember/object';
import { service } from '@ember/service';
import uniqReducer from 'codecrafters-frontend/utils/uniq-reducer';
import type RouterService from '@ember/routing/router-service';
import type CourseParticipationModel from 'codecrafters-frontend/models/course-participation';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    courseParticipations: CourseParticipationModel[];
  };
}

export default class CourseProgressListItem extends Component<Signature> {
  @service declare router: RouterService;

  get completedAt() {
    return this.completedCourseParticipations[0]?.completedAt || null;
  }

  get completedCourseParticipations() {
    return this.args.courseParticipations.filter((item) => item.isCompleted);
  }

  get completedStagesCount() {
    return Math.max(...this.args.courseParticipations.map((item) => item.completedStageSlugs).map((stage_list) => stage_list.length));
  }

  get course() {
    return this.args.courseParticipations[0]!.course;
  }

  get hasCompletedCourseUsingAnyLanguage() {
    return this.completedCourseParticipations.length > 0;
  }

  get languagesText() {
    if (this.hasCompletedCourseUsingAnyLanguage) {
      return `using ${arrayToSentence(this.completedCourseParticipations.map((item) => item.language.name).reduce(uniqReducer(), []))}`;
    } else {
      return `using ${arrayToSentence(this.args.courseParticipations.map((item) => item.language.name).reduce(uniqReducer(), []))}`;
    }
  }

  @action
  navigateToCourse() {
    this.router.transitionTo('course-overview', this.course.slug);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'UserPage::CourseProgressListItem': typeof CourseProgressListItem;
  }
}
