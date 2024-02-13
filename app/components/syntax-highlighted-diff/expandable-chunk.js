import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CollapsibleChunkComponent extends Component {
  @tracked isCollapsed;

  constructor() {
    super(...arguments);
    this.isCollapsed = this.args.chunk.isCollapsed;
  }

  @action
  handleClick() {
    this.isCollapsed = !this.isCollapsed;
  }
}
