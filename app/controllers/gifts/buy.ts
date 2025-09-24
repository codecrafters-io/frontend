import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import type Store from '@ember-data/store';
import type GiftPaymentFlowModel from 'codecrafters-frontend/models/gift-payment-flow';
import { fade } from 'ember-animated/transitions/fade';

export default class GiftsBuyController extends Controller {
  transition = fade;

  declare model: GiftPaymentFlowModel;
  @service declare store: Store;

  queryParams = [{ giftPaymentFlowId: 'f' }];

  @tracked completedSteps: number[] = [];
  @tracked currentStep: number = 1;
  @tracked giftPaymentFlowId: string | undefined = undefined;

  @action
  handleContinueButtonClick() {
    if (this.model.id) {
      this.giftPaymentFlowId = this.model.id;
    }

    this.completedSteps = [...this.completedSteps, this.currentStep];
    this.currentStep = this.currentStep + 1;
    scrollToTop();
  }

  @action
  handleNavigationItemClick(step: number) {
    if (step === 1 || this.completedSteps.includes(step - 1)) {
      this.currentStep = step;
    }
  }
}
