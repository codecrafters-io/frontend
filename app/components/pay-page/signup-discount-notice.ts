import Component from '@glimmer/component';
import PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';
import iconImage from '/assets/images/icons/money.svg';
import { service } from '@ember/service';
import type TimeService from 'codecrafters-frontend/services/time';
import { formatTimeLeft } from 'codecrafters-frontend/utils/time-formatting';
interface Signature {
  Element: HTMLDivElement;

  Args: {
    discount: PromotionalDiscountModel;
    variant?: 'default' | 'countdown';
  };
}

export default class SignupDiscountNoticeComponent extends Component<Signature> {
  iconImage = iconImage;

  @service declare time: TimeService;

  get timeLeftText() {
    return formatTimeLeft(this.args.discount.expiresAt, this.time.currentTime);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::SignupDiscountNotice': typeof SignupDiscountNoticeComponent;
  }
}
