import Component from '@glimmer/component';
import { action } from '@ember/object';
import type GiftPaymentFlowModel from 'codecrafters-frontend/models/gift-payment-flow';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    giftPaymentFlow: GiftPaymentFlowModel;
    onContinueButtonClick: () => void;
  };
}

export default class EnterDetailsStepContainer extends Component<Signature> {
  formElement: HTMLFormElement | null = null;

  @tracked continueButtonIsDisabled = true;

  get giftMessageInputPlaceholder() {
    return `Hey Jess!

Hope you enjoy learning with CodeCrafters.`;
  }

  @action
  async handleDidInsertFormElement(formElement: HTMLFormElement) {
    this.formElement = formElement;
    this.continueButtonIsDisabled = !this.formElement.checkValidity();
  }

  @action
  async handleFormSubmit(e: Event) {
    e.preventDefault();

    this.formElement!.reportValidity();

    if (this.formElement!.checkValidity()) {
      await this.saveGiftPaymentFlowTask.perform();
      this.args.onContinueButtonClick();
    }
  }

  @action
  async handleInputBlur() {
    if (this.formElement!.checkValidity()) {
      this.saveGiftPaymentFlowTask.perform();
    }

    this.continueButtonIsDisabled = !this.formElement!.checkValidity();
  }

  saveGiftPaymentFlowTask = task({ keepLatest: true }, async (): Promise<void> => {
    await this.args.giftPaymentFlow.save();
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'GiftPaymentPage::EnterDetailsStepContainer': typeof EnterDetailsStepContainer;
  }
}
