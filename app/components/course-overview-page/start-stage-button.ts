import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    course: CourseModel;
  };
}

export default class CourseOverviewStartStageButtonComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get currentUserIsAnonymous() {
    return this.authenticator.isAnonymous;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::StartStageButton': typeof CourseOverviewStartStageButtonComponent;
  }
}
