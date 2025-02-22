import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type ConceptModel from 'codecrafters-frontend/models/concept';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    isComplete: boolean;
    concept: ConceptModel;
  };
}

export default class ConceptListItemComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::PrimerConceptGroupSection::ConceptListItem': typeof ConceptListItemComponent;
  }
}
