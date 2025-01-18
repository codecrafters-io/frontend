import Component from '@glimmer/component';
import PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    discount: PromotionalDiscountModel;
  };
}

export default class SignupDiscountNoticeComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::SignupDiscountNotice': typeof SignupDiscountNoticeComponent;
  }
}
