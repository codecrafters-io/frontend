import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import { format } from 'date-fns';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
  };
}

export default class Notices extends Component<Signature> {
  get formattedCourseIsFreeExpirationDate() {
    if (this.args.course.isFreeUntil) {
      return format(this.args.course.isFreeUntil, 'd MMMM yyyy');
    } else {
      return null;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::Notices': typeof Notices;
  }
}
