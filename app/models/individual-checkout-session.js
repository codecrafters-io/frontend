import Model, { attr, belongsTo } from '@ember-data/model';

export default class IndividualCheckoutSessionModel extends Model {
  @belongsTo('regional-discount', { async: false }) regionalDiscount;

  @attr('boolean') autoRenewSubscription;
  @attr('boolean') earlyBirdDiscountEnabled;
  @attr('string') promotionCode;
  @attr('boolean') referralDiscountEnabled;
  @attr('string') successUrl;
  @attr('string') cancelUrl;
  @attr('string') url;
  @attr('string') pricingFrequency;
}
