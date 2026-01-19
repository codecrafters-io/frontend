import Component from '@glimmer/component';
import RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    regionalDiscount: RegionalDiscountModel;
  };
}

export default class RegionalDiscountNotice extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::RegionalDiscountNotice': typeof RegionalDiscountNotice;
  }
}
