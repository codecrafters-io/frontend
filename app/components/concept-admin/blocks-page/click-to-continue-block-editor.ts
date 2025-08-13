import Component from '@glimmer/component';
import { ClickToContinueBlockDefinition } from 'codecrafters-frontend/utils/block-definitions';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    model: ClickToContinueBlockDefinition;
  };
}

export default class ClickToContinueBlockEditor extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::ClickToContinueBlockEditor': typeof ClickToContinueBlockEditor;
  }
}
