import Component from '@glimmer/component';
import logoImage from '/assets/images/logo/logomark-color.svg';
import type MembershipGiftModel from 'codecrafters-frontend/models/membership-gift';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    membershipGift: MembershipGiftModel;
  };
}

export default class RedeemGiftPageGiftCard extends Component<Signature> {
  logoImage = logoImage;

  get expiryDateText(): string {
    const purchasedAt = this.args.membershipGift.purchasedAt;
    const validityInDays = this.args.membershipGift.validityInDays;

    const expiryDate = new Date(purchasedAt);
    expiryDate.setDate(expiryDate.getDate() + validityInDays);

    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const day = expiryDate.getDate();
    const month = months[expiryDate.getMonth()];
    const year = expiryDate.getFullYear().toString().slice(-2);

    return `${day} ${month} '${year}`;
  }

  get validityPeriodText(): string {
    const days = this.args.membershipGift.validityInDays;
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years >= 1) {
      return years === 1 ? '1 year' : `${years} years`;
    } else if (months >= 1) {
      return months === 1 ? '1 month' : `${months} months`;
    } else {
      return days === 1 ? '1 day' : `${days} days`;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'RedeemGiftPage::GiftCard': typeof RedeemGiftPageGiftCard;
  }
}
