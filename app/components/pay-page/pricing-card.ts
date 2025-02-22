import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Store from '@ember-data/store';
import type RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    actualPrice: number;
    discountedPrice: number | null;
    highlightedText?: string;
    footerText: string;
    onStartMembershipButtonClick: (pricingFrequency: 'quarterly' | 'yearly' | 'lifetime') => void;
    isRecommended: boolean;
    pricingFrequency: 'quarterly' | 'yearly' | 'lifetime';
    regionalDiscount?: RegionalDiscountModel | null; // The "| null" makes it easier to use {{(if ..)}} in the template
    shouldShowAmortizedMonthlyPrice: boolean;
    temporaryNoticeText?: string;
    temporaryNoticeTooltipText?: string;
    title: string;
  };
}

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
      { text: 'No limits on content', link: 'https://docs.codecrafters.io/content' },
      { text: 'Turbo test runs', link: 'https://codecrafters.io/turbo' },
      { text: 'Code examples', link: 'https://docs.codecrafters.io/code-examples' },
      { text: 'Dark mode', link: 'https://docs.codecrafters.io/membership/dark-mode' },
      { text: 'Anonymous mode', link: 'https://docs.codecrafters.io/membership/anonymous-mode' },
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::PricingCard': typeof PricingCardComponent;
  }
}
