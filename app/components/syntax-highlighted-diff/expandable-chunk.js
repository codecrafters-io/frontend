import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CollapsibleChunkComponent extends Component {
  @service authenticator;
  @tracked isCollapsed = this.args.chunk.isCollapsed;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  @action
  handleClick() {
    this.isCollapsed = !this.isCollapsed;
  }
}
