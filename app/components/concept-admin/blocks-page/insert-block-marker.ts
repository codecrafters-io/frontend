import Component from '@glimmer/component';
import { Block } from 'codecrafters-frontend/models/concept';
import { ClickToContinueBlock, ConceptQuestionBlock, MarkdownBlock } from 'codecrafters-frontend/lib/blocks';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onBlockAdded: (block: Block) => void;
    isVisibleWithoutHover: boolean;
  };
}

export default class InsertBlockMarkerComponent extends Component<Signature> {
  @action
  handleBlockTypeChosen(blockType: Block['type'], closeDropdownFn: () => void) {
    const newBlock = this.newBlockForType(blockType);

    this.args.onBlockAdded(newBlock);
    closeDropdownFn();
  }

  newBlockForType(blockType: Block['type']): Block {
    if (blockType === 'markdown') {
      return new MarkdownBlock({
        type: blockType,
        args: {
          markdown: 'Hello, world!',
        },
      });
    } else if (blockType === 'click_to_continue') {
      return new ClickToContinueBlock({
        type: blockType,
        args: {},
      });
    } else if (blockType === 'concept_question') {
      return new ConceptQuestionBlock({
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
