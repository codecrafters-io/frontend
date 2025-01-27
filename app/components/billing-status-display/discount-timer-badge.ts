import Component from '@glimmer/component';
import iconImage from '/assets/images/icons/money.svg';
import { service } from '@ember/service';
import type TimeService from 'codecrafters-frontend/services/time';
import { formatTimeDurationForBadge, formatTimeDurationForCountdown } from 'codecrafters-frontend/utils/time-formatting';
import type PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    discount: PromotionalDiscountModel;
    size: 'small' | 'large'; // small is used for the menu bar, large is used for the course page header
  };
}

export default class DiscountTimerBadgeComponent extends Component<Signature> {
  iconImage = iconImage;

  @service declare time: TimeService;

  get expiresAt() {
    return this.args.discount.expiresAt;
  }

  get isExpired() {
    return this.args.discount.isExpired;
  }

  get timeLeft() {
    return formatTimeDurationForBadge(this.expiresAt, this.time.currentTime);
  }

  get tooltipText() {
    return `Upgrade in ${formatTimeDurationForCountdown(this.expiresAt, this.time.currentTime)} to get 40% off the annual plan. Click to view details.`;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'BillingStatusDisplay::DiscountTimerBadge': typeof DiscountTimerBadgeComponent;
  }
}
