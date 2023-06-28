import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class FaqItemComponent extends Component {
  @action
  toggleItem() {
    this.args.onToggle(this.args.faq);
  }
}
