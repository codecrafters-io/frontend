import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { ConceptQuestionBlock } from 'codecrafters-frontend/lib/blocks';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    model: ConceptQuestionBlock;
    onSubmit: () => void;
  };
};

export default class ConceptQuestionBlockComponent extends Component<Signature> {
  @service declare store: Store;

  get question() {
    return this.store.peekAll('concept-question').findBy('slug', this.args.model.conceptQuestionSlug);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Blocks::ConceptQuestionBlock': typeof ConceptQuestionBlockComponent;
  }
}
