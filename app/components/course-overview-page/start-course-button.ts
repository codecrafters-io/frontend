import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { inject as service } from '@ember/service';
import type { BaseButtonSignature } from '../base-button';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    course: CourseModel;
    size?: BaseButtonSignature['Args']['size'];
  };
}

export default class CourseOverviewStartCourseButtonComponent extends Component<Signature> {
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
    'CourseOverviewPage::StartCourseButton': typeof CourseOverviewStartCourseButtonComponent;
  }
}
