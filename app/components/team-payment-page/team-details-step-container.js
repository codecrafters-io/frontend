import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TeamDetailsFormComponent extends Component {
  @action
  async handleValueUpdated() {
    this.args.teamPaymentFlow.save();
  }
}
