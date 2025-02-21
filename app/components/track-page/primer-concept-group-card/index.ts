import Component from '@glimmer/component';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import LanguageModel from 'codecrafters-frontend/models/language';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
    conceptGroup: ConceptGroupModel;
  };
}

export default class TrackPagePrimerConceptGroupCardComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::PrimerConceptGroupCard': typeof TrackPagePrimerConceptGroupCardComponent;
  }
}
