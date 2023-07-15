import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ReferredUsersContainerComponent extends Component {
  @tracked
  areAllSignupsShown = false;

  get referralLink() {
    return this.args.referralLink;
  }

  get paidActivations() {
    return this.referralLink.visibleActivations.filter((activation) => activation.spentAmountInDollars > 0);
  }

  get unpaidActivations() {
    return this.referralLink.visibleActivations.filter((activation) => {
      if (!activation.spentAmountInDollars) {
        return activation;
      }
    });
  }

  @action
  handleShowAllSignupsClick() {
    this.areAllSignupsShown = !this.areAllSignupsShown;
  }
}
