import Component from '@glimmer/component';
import { ClickToContinueBlock } from 'codecrafters-frontend/lib/blocks';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    model: ClickToContinueBlock;
  };
}

export default class ClickToContinueBlockEditorComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::ClickToContinueBlockEditor': typeof ClickToContinueBlockEditorComponent;
  }
}
