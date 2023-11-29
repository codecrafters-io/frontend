import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import CourseModel from 'codecrafters-frontend/models/course';
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

type Positional = [CourseModel];

export interface Signature {
  Args: {
    Positional: Positional;
  };
  Return: boolean;
}

export default class CurrentUserIsCourseAuthor extends Helper<Signature> {
  @service declare authenticator: AuthenticatorService;

  public compute(positional: Positional): boolean {
    const course = positional[0];

    return !!(this.authenticator.currentUser && this.authenticator.currentUser.isCourseAuthor(course));
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'current-user-is-course-author': typeof CurrentUserIsCourseAuthor;
  }
}
