import Component from '@glimmer/component';
import ConceptModel from 'codecrafters-frontend/models/concept';

type Signature = {
  Args: {
    concept: ConceptModel;
  };

  Element: HTMLDivElement;
};

export default class ConceptCompletedModal extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptPage::ConceptCompletedModal': typeof ConceptCompletedModal;
  }
}
