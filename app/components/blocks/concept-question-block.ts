import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { ConceptQuestionBlock, ExtendedBlock } from 'codecrafters-frontend/lib/blocks';
import { action } from '@ember/object';

import Prism from 'prismjs';
import 'prismjs/components/prism-rust'; // This is the only one we use in concepts at the moment

type Signature = {
  Element: HTMLDivElement;

  Args: {
    model: ExtendedBlock;
    onSubmit: () => void;
  };
};

export default class ConceptQuestionBlockComponent extends Component<Signature> {
  @service declare store: Store;

  get model() {
    if (this.args.model.type === 'concept_question') {
      return this.args.model as ConceptQuestionBlock;
    }

    return;
  }

  get question() {
    return this.store.peekAll('concept-question').findBy('slug', this.model?.conceptQuestionSlug);
  }

  @action
  handleDidInsertHTML(element: HTMLDivElement) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleDidUpdateHTML(element: HTMLDivElement) {
    Prism.highlightAllUnder(element);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Blocks::ConceptQuestionBlock': typeof ConceptQuestionBlockComponent;
  }
}
