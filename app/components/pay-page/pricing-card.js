import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class PricingCardComponent extends Component {
  @service authenticator;
  @service store;

  get actualAmortizedMonthlyPrice() {
    return Math.round((this.args.actualPrice / this.numberOfMonths) * 100) / 100;
  }

  get discountedAmortizedMonthlyPrice() {
    if (this.args.discountedPrice === null) {
      return null;
    }

    return Math.round((this.args.discountedPrice / this.numberOfMonths) * 100) / 100;
  }

  get featureDescriptions() {
    return ['One time payment', 'No limits on content', 'Community features', 'Access to Perks', 'Priority support'];
  }

  get numberOfMonths() {
    if (this.args.pricingFrequency === 'quarterly') {
      return 3;
    } else if (this.args.pricingFrequency === 'yearly') {
      return 12;
    } else {
      throw new Error(`Unknown pricing frequency: ${this.args.pricingFrequency}`);
    }
  }

  get user() {
    return this.authenticator.currentUser;
  }
}
