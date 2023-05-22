import Model, { attr } from '@ember-data/model';

export default class IndividualCheckoutSessionModel extends Model {
  @attr('string') customDiscountId;
  @attr('boolean') autoRenewSubscription;
  @attr('boolean') earlyBirdDiscountEnabled;
  @attr('string') promotionCode;
  @attr('boolean') referralDiscountEnabled;
  @attr('string') successUrl;
  @attr('boolean') trialDisabled;
  @attr('string') cancelUrl;
  @attr('string') url;
  @attr('string') pricingFrequency;
}
