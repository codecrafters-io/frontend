import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Store from '@ember-data/store';
import type RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    actualPrice: number;
    discountedPrice: number | null;
    highlightedText?: string;
    footerText: string;
    onStartMembershipButtonClick: () => void;
    isRecommended: boolean;
    pricingFrequency: 'quarterly' | 'yearly' | 'lifetime';
    regionalDiscount?: RegionalDiscountModel;
    shouldShowAmortizedMonthlyPrice: boolean;
    title: string;
  };
};

export default class PricingCardComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

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
    return [
      { text: 'One time payment' },
      { text: 'No limits on content' },
      { text: 'Turbo test runs', link: 'https://codecrafters.io/turbo' },
      { text: 'Community features' },
      { text: 'Access to Perks', link: 'https://codecrafters.io/perks' },
      { text: 'Priority support' },
    ];
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
