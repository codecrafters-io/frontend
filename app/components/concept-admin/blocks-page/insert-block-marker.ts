import Component from '@glimmer/component';
import { Block } from 'codecrafters-frontend/models/concept';
import { MarkdownBlock } from 'codecrafters-frontend/lib/blocks';
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
    return new MarkdownBlock({
      type: blockType,
      args: {
        markdown: 'Hello, world!',
      },
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::InsertBlockMarker': typeof InsertBlockMarkerComponent;
  }
}
