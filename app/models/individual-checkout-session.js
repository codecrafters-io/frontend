import Model, { attr, belongsTo } from '@ember-data/model';

export default class IndividualCheckoutSessionModel extends Model {
  @belongsTo('custom-discount', { async: false }) customDiscount;
  @belongsTo('regional-discount', { async: false }) regionalDiscount;

  @attr('string') customDiscountId;
  @attr('boolean') autoRenewSubscription;
  @attr('boolean') earlyBirdDiscountEnabled;
  @attr('string') promotionCode;
  @attr('boolean') referralDiscountEnabled;
  @attr('string') successUrl;
  @attr('string') cancelUrl;
  @attr('string') url;
  @attr('string') pricingFrequency;
}
