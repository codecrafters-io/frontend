import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';
import type RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    onClose: () => void;
    regionalDiscount?: RegionalDiscountModel | null;
    shouldApplyRegionalDiscount?: boolean;
  };
}

export default class ChooseMembershipPlanModal extends Component<Signature> {
  transition = fade;
  @tracked previewType: 'plan' | 'invoice-details' = 'plan';
  @tracked selectedPlan: '3-month' | '1-year' | 'lifetime' = '3-month';

  get selectedPlanText() {
    switch (this.selectedPlan) {
      case '3-month':
        return '3 month pass';
      case '1-year':
        return '1 year pass';
      case 'lifetime':
        return 'Lifetime pass';
      default:
        return '3 month pass';
    }
  }

  @action
  handleChangePlanButtonClick() {
    this.previewType = 'plan';
  }

  @action
  handleChoosePlanButtonClick() {
    this.previewType = 'invoice-details';
  }

  @action
  selectPlan(plan: '3-month' | '1-year' | 'lifetime') {
    this.selectedPlan = plan;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::ChooseMembershipPlanModal': typeof ChooseMembershipPlanModal;
  }
}
