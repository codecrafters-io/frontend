import Component from '@glimmer/component';
import PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';
import iconImage from '/assets/images/icons/money.svg';
import { service } from '@ember/service';
import type TimeService from 'codecrafters-frontend/services/time';
import { formatTimeDurationForCountdown } from 'codecrafters-frontend/utils/time-formatting';
interface Signature {
  Element: HTMLDivElement;

  Args: {
    discount: PromotionalDiscountModel;
  };
}

export default class SignupDiscountNotice extends Component<Signature> {
  iconImage = iconImage;

  @service declare time: TimeService;

  get discountedPrice() {
    return this.args.discount.computeDiscountedPrice(360);
  }

  get timeLeftText() {
    return formatTimeDurationForCountdown(this.args.discount.expiresAt, this.time.currentTime);
  }

  get tooltipText() {
    return `The 1 year plan is usually $360, but you can get it for $${Math.round(this.discountedPrice)} with this offer.`;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::SignupDiscountNotice': typeof SignupDiscountNotice;
  }
}
