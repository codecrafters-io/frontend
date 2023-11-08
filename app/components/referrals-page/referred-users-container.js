import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ReferredUsersContainerComponent extends Component {
  @tracked unpaidActivationsAreVisible = false;

  get affiliateLink() {
    return this.args.affiliateLink;
  }

  get paidActivations() {
    return this.affiliateLink.visibleActivations.filter((activation) => activation.spentAmountInDollars > 0);
  }

  get unpaidActivations() {
    return this.affiliateLink.visibleActivations.filter((activation) => !activation.spentAmountInDollars);
  }
}
