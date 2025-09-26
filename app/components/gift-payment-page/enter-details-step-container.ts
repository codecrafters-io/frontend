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

  @tracked isProcessingContinueButtonClick = false;
  @tracked formInputsAreValid = false;

  get giftMessageInputPlaceholder() {
    return `Hey Jess!

Hope you enjoy learning with CodeCrafters.`;
  }

  @action
  async handleDidInsertFormElement(formElement: HTMLFormElement) {
    this.formElement = formElement;
    this.recomputeFormInputsAreValid();
  }

  @action
  async handleFormSubmit(e: Event) {
    e.preventDefault();

    this.formElement!.reportValidity();
    this.recomputeFormInputsAreValid();

    if (this.formInputsAreValid) {
      this.isProcessingContinueButtonClick = true;
      await this.saveGiftPaymentFlowTask.perform();
      this.args.onContinueButtonClick();
    }
  }

  @action
  async handleInputBlur() {
    this.recomputeFormInputsAreValid();

    if (this.formInputsAreValid) {
      this.saveGiftPaymentFlowTask.perform();
    }
  }

  @action
  recomputeFormInputsAreValid() {
    this.formInputsAreValid = this.formElement!.checkValidity();
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
