import Model, { attr } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';

export default class GiftPaymentFlowModel extends Model {
  @attr('string') declare giftMessage: string;
  @attr('string') declare pricingPlanId: string;
  @attr('string') declare senderEmailAddress: string;

  declare generateCheckoutSession: (this: GiftPaymentFlowModel, payload: { successUrl: string; cancelUrl: string }) => Promise<{ link: string }>;
}

GiftPaymentFlowModel.prototype.generateCheckoutSession = memberAction({
  path: 'generate-checkout-session',
  type: 'post',
});
