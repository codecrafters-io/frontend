import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
  };
}

export default class CourseOverviewPageHeaderComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get currentUserHasStartedCourse() {
    return this.authenticator.currentUser && this.authenticator.currentUser.hasStartedCourse(this.args.course);
  }

  get currentUserIsAnonymous() {
    return this.authenticator.isAnonymous;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::Header': typeof CourseOverviewPageHeaderComponent;
  }
}
