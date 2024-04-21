import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { ConceptQuestionBlock } from 'codecrafters-frontend/utils/blocks';
import { action } from '@ember/object';

import Prism from 'prismjs';
import 'prismjs/components/prism-rust'; // This is the only one we use in concepts at the moment
import { tracked } from '@glimmer/tracking';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    model: ConceptQuestionBlock;
    onContinueButtonClick: () => void;
    onStepBackButtonClick: () => void;
    isCurrentBlock: boolean;
  };
};

export default class ConceptQuestionBlockComponent extends Component<Signature> {
  @tracked isSubmitted = false;
  @tracked continueOrStepBackElement: HTMLDivElement | null = null;
  @service declare store: Store;

  get question() {
    return this.store.peekAll('concept-question').findBy('slug', this.args.model.conceptQuestionSlug);
  }

  @action
  handleDidInsertContinueOrStepBackElement(element: HTMLDivElement) {
    this.continueOrStepBackElement = element;
  }

  @action
  handleDidInsertHTML(element: HTMLDivElement) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleDidUpdateHTML(element: HTMLDivElement) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleSubmit() {
    this.isSubmitted = true;

    if (this.continueOrStepBackElement) {
      this.continueOrStepBackElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Blocks::ConceptQuestionBlock': typeof ConceptQuestionBlockComponent;
  }
}
