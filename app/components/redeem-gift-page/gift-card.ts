import Component from '@glimmer/component';
import logoImage from '/assets/images/logo/logomark-color.svg';

interface Signature {
  Element: HTMLDivElement;
}

export default class RedeemGiftPageGiftCard extends Component<Signature> {
  logoImage = logoImage;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'RedeemGiftPage::GiftCard': typeof RedeemGiftPageGiftCard;
  }
}
