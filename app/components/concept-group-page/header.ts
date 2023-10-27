import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    conceptGroup: ConceptGroupModel;
  };
}

export default class HeaderComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptGroupPage::Header': typeof HeaderComponent;
  }
}
