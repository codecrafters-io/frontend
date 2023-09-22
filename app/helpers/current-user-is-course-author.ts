import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Helper from '@ember/component/helper';
import { TemporaryCourseModel } from 'codecrafters-frontend/models/temporary-types';
import { inject as service } from '@ember/service';

type Positional = [TemporaryCourseModel];

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
