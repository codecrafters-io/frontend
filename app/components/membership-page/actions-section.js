import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import window from 'ember-window-mock';

export default class ActionsSectionComponent extends Component {
  @tracked isCancellingTrial = false;
  @service router;

  @action
  async handleCancelTrialButtonClick() {
    if (window.confirm(`Are you sure you want to cancel your trial?`)) {
      this.isCancellingTrial = true;
      await this.args.subscription.cancelTrial();
      this.isCancellingTrial = false;
    }
  }

  @action
  async handleStartMembershipButtonClick() {
    this.router.transitionTo('pay');
  }
}
