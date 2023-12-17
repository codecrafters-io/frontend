import { action } from '@ember/object';
import Component from '@glimmer/component';
import { ConceptQuestionBlock } from 'codecrafters-frontend/utils/blocks';
import ConceptModel from 'codecrafters-frontend/models/concept';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    model: ConceptQuestionBlock;
    concept: ConceptModel;
  };
}

export default class ConceptQuestionBlockEditorComponent extends Component<Signature> {
  @action
  handleConceptQuestionSlugSelected(event: Event) {
    this.args.model.conceptQuestionSlug = (event.target! as HTMLSelectElement).value;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::ConceptQuestionBlockEditor': typeof ConceptQuestionBlockEditorComponent;
  }
}
