import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { format } from 'date-fns';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
  };
}

export default class NoticesComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

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
    'CourseOverviewPage::Notices': typeof NoticesComponent;
  }
}
