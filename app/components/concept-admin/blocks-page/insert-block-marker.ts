import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;
}

export default class InsertBlockMarkerComponent extends Component<Signature> {
  @tracked isChoosingBlockType = false;

  @action
  handleClick() {
    this.isChoosingBlockType = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::InsertBlockMarker': typeof InsertBlockMarkerComponent;
  }
}
