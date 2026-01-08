import type Store from '@ember-data/store';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
  };
}

export default class PaidCourseNotice extends Component<Signature> {
  @service declare store: Store;

  get betaCourse(): CourseModel | null {
    return (
      (this.store.peekAll('course') as unknown as CourseModel[])
        .toSorted(fieldComparator('sortPositionForTrack'))
        .find((course: CourseModel) => course.releaseStatusIsBeta) || null
    );
  }

  get freeCourse(): CourseModel | null {
    return (
      (this.store.peekAll('course') as unknown as CourseModel[])
        .toSorted(fieldComparator('sortPositionForTrack'))
        .find((course: CourseModel) => course.isFree) || null
    );
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
