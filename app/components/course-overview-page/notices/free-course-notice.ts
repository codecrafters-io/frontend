import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import { format, isSameDay } from 'date-fns';
import TimeService from 'codecrafters-frontend/services/time';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
  };
}

export default class FreeCourseNotice extends Component<Signature> {
  @service declare time: TimeService;

  get isFreeForCurrentMonth(): boolean {
    const now = this.time.currentTime;
    const courseIsFreeExpirationDate = this.args.course.isFreeUntil!;
    const lastDayOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return isSameDay(courseIsFreeExpirationDate, lastDayOfThisMonth) || isSameDay(courseIsFreeExpirationDate, firstDayOfNextMonth);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::Notices::FreeCourseNotice': typeof FreeCourseNotice;
  }
}
