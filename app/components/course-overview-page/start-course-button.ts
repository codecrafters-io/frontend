import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { service } from '@ember/service';
import type { BaseButtonSignature } from '../base-button';
import type LanguageModel from 'codecrafters-frontend/models/language';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    course: CourseModel;
    language?: LanguageModel;
    size?: BaseButtonSignature['Args']['size'];
  };
}

export default class CourseOverviewStartCourseButton extends Component<Signature> {
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
    'CourseOverviewPage::StartCourseButton': typeof CourseOverviewStartCourseButton;
  }
}
