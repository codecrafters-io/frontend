import Component from '@glimmer/component';
import ConceptModel from 'codecrafters-frontend/models/concept';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    concepts: Array<ConceptModel>;
  };
}

export default class ContentComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptGroupPage::Content': typeof ContentComponent;
  }
}
