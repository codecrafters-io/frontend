import Component from '@glimmer/component';
import ConceptModel from 'codecrafters-frontend/models/concept';
import type ConceptGroupModel from 'codecrafters-frontend/models/concept-group';

type Signature = {
  Args: {
    concept: ConceptModel;
    conceptGroup: ConceptGroupModel;
  };

  Element: HTMLDivElement;
};

export default class ConceptCompletedModal extends Component<Signature> {
  get getAccessToMessage() {
    if (this.args.conceptGroup?.title) {
      return `the rest of ${this.args.conceptGroup.title}`;
    }

    return 'all CodeCrafters concepts';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptPage::ConceptCompletedModal': typeof ConceptCompletedModal;
  }
}
