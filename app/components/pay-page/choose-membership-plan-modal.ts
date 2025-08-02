import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    onClose: () => void;
  };
}

export default class ChooseMembershipPlanModal extends Component<Signature> {
  transition = fade;
  @tracked previewType: 'plan' | 'invoice-details' = 'plan';

  @action
  handleChangePlanButtonClick() {
    this.previewType = 'plan';
  }

  @action
  handleChoosePlanButtonClick() {
    this.previewType = 'invoice-details';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::ChooseMembershipPlanModal': typeof ChooseMembershipPlanModal;
  }
}
