import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ReferredUsersContainerComponent extends Component {
  @tracked unpaidActivationsAreVisible = false;

  get referralLink() {
    return this.args.referralLink;
  }

  get paidActivations() {
    return this.referralLink.visibleActivations.filter((activation) => activation.spentAmountInDollars > 0);
  }

  get unpaidActivations() {
    return this.referralLink.visibleActivations.filter((activation) => !activation.spentAmountInDollars);
  }
}
