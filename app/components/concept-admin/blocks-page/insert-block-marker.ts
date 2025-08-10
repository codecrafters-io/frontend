import Component from '@glimmer/component';
import { type BlockDefinition } from 'codecrafters-frontend/models/concept';
import {
  ClickToContinueBlockDefinition,
  ConceptQuestionBlockDefinition,
  MarkdownBlockDefinition,
} from 'codecrafters-frontend/utils/block-definitions';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isVisibleWithoutHover: boolean;
    onBlockAdded: (block: BlockDefinition) => void;
  };
}

export default class InsertBlockMarkerComponent extends Component<Signature> {
  @action
  handleBlockTypeChosen(blockType: BlockDefinition['type'], closeDropdownFn: () => void) {
    const newBlock = this.newBlockForType(blockType);

    this.args.onBlockAdded(newBlock);
    closeDropdownFn();
  }

  newBlockForType(blockType: BlockDefinition['type']): BlockDefinition {
    if (blockType === 'markdown') {
      return new MarkdownBlockDefinition({
        type: blockType,
        args: {
          markdown: 'Hello, world!',
        },
      });
    } else if (blockType === 'click_to_continue') {
      return new ClickToContinueBlockDefinition({
        type: blockType,
        args: {},
      });
    } else if (blockType === 'concept_question') {
      return new ConceptQuestionBlockDefinition({
        type: blockType,
        args: {},
      });
    } else {
      throw new Error(`Unknown block type: ${blockType}`);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::InsertBlockMarker': typeof InsertBlockMarkerComponent;
  }
}
