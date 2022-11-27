import Model, { attr, belongsTo } from '@ember-data/model';

export default class ReferralActivationModel extends Model {
  @belongsTo('user', { async: false, inverse: 'referralActivationsAsCustomer' }) customer;
  @belongsTo('user', { async: false }) referrer;
  @belongsTo('referral-link', { async: false }) referralLink;

  @attr('date') activatedAt;
  @attr('string') status; // 'pending_trial', 'trial', 'paid'

  get discountPeriodEndsAt() {
    return new Date(this.activatedAt.getTime() + 3 * 24 * 60 * 60 * 1000);
  }

  get isWithinDiscountPeriod() {
    return this.discountPeriodEndsAt > new Date();
  }
}
