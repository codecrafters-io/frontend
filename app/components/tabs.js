import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class TabsComponent extends Component {
  @tracked activeTabSlug;

  constructor() {
    super(...arguments);
    this.activeTabSlug = this.args.tabs[0].slug;
  }
}
