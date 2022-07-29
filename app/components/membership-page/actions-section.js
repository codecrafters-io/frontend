import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import window from 'ember-window-mock';

export default class ActionsSectionComponent extends Component {
  @tracked isCancellingTrial = false;

  @action
  handleCancelTrialButtonClick() {
    if (window.confirm(`Are you sure you want to cancel your trial?`)) {
      this.isCancellingTrial = true;
      await this.args.subscription.cancelTrial();
    }
  }
}
