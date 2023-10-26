import ConceptModel from 'codecrafters-frontend/models/concept';
import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    color?: string;
    concept: ConceptModel;
  };
}

export default class ConceptCardComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptGroupPage::ConceptCard': typeof ConceptCardComponent;
  }
}
