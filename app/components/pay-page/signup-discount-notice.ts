import Component from '@glimmer/component';
import PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';
import iconImage from '/assets/images/icons/money.svg';
import { service } from '@ember/service';
import type TimeService from 'codecrafters-frontend/services/time';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    discount: PromotionalDiscountModel;
  };
}

export default class SignupDiscountNoticeComponent extends Component<Signature> {
  iconImage = iconImage;

  @service declare time: TimeService;

  get timeLeftText() {
    const distanceInSeconds = Math.floor((this.args.discount.expiresAt.getTime() - this.time.currentTime.getTime()) / 1000);
    const hoursLeft = Math.floor(distanceInSeconds / 60 / 60);
    const minutesLeft = Math.floor(distanceInSeconds / 60) - hoursLeft * 60;
    const secondsLeft = distanceInSeconds - hoursLeft * 60 * 60 - minutesLeft * 60;

    const hoursLeftStr = `${hoursLeft.toString().padStart(2, '0')}h`;
    const minutesLeftStr = `${minutesLeft.toString().padStart(2, '0')}m`;
    const secondsLeftStr = `${secondsLeft.toString().padStart(2, '0')}s`;

    if (hoursLeft > 0) {
      return `${hoursLeftStr}:${minutesLeftStr}:${secondsLeftStr}`;
    }

    if (minutesLeft > 0) {
      return `${minutesLeftStr}:${secondsLeftStr}`;
    }

    return `${secondsLeftStr}`;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::SignupDiscountNotice': typeof SignupDiscountNoticeComponent;
  }
}
