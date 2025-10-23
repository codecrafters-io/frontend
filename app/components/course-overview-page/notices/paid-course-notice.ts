import type Store from '@ember-data/store';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
  };
}

export default class PaidCourseNotice extends Component<Signature> {
  @service declare store: Store;

  get betaCourse(): CourseModel | null {
    return this.store.peekAll('course').find((course: CourseModel) => course.releaseStatusIsBeta);
  }

  get freeCourse(): CourseModel | null {
    return this.store.peekAll('course').find((course: CourseModel) => course.isFree);
  }

  get freeOrBetaCourse(): CourseModel | null {
    return this.freeCourse || this.betaCourse;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::Notices::PaidCourseNotice': typeof PaidCourseNotice;
  }
}
