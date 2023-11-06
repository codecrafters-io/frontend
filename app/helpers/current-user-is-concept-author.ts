import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import ConceptModel from 'codecrafters-frontend/models/concept';

type Positional = [ConceptModel];

export interface Signature {
  Args: {
    Positional: Positional;
  };
  Return: boolean;
}

export default class CurrentUserIsConceptAuthor extends Helper<Signature> {
  @service declare authenticator: AuthenticatorService;

  public compute(positional: Positional): boolean {
    const concept = positional[0];

    return !!(this.authenticator.currentUser && concept?.author == this.authenticator.currentUser);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'current-user-is-concept-author': typeof CurrentUserIsConceptAuthor;
  }
}
