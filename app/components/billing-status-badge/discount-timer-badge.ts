import Component from '@glimmer/component';
import iconImage from '/assets/images/icons/money.svg';
import { service } from '@ember/service';
import type TimeService from 'codecrafters-frontend/services/time';
import { formatTimeLeft } from 'codecrafters-frontend/utils/time-formatting';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    size: 'small' | 'large'; // small is used for the menu bar, large is used for the course page header
  };
}

export default class DiscountTimerBadgeComponent extends Component<Signature> {
  iconImage = iconImage;

  @service declare time: TimeService;

  // (TODO: Use actual discount expiration date)
  expiresAt = new Date(new Date().getTime() + 23 * 60 * 60 * 1000);

  get tooltipText() {
    return `Upgrade in ${formatTimeLeft(this.expiresAt, this.time.currentTime)} to get 40% off the annual plan. Click to view details.`;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'BillingStatusBadge::DiscountTimerBadge': typeof DiscountTimerBadgeComponent;
  }
}
