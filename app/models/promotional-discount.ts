import AffiliateReferralModel from 'codecrafters-frontend/models/affiliate-referral';
import Model, { attr, belongsTo } from '@ember-data/model';
import UserModel from 'codecrafters-frontend/models/user';
import type TimeService from 'codecrafters-frontend/services/time';
import { service } from '@ember/service';

export default class PromotionalDiscountModel extends Model {
  @belongsTo('affiliate-referral', { async: false, inverse: null }) declare affiliateReferral: AffiliateReferralModel;
  @belongsTo('user', { async: false, inverse: 'promotionalDiscounts' }) declare user: UserModel;

  @attr('date') createdAt!: Date;
  @attr('date') expiresAt!: Date;
  @attr('string') type!: 'signup' | 'affiliate_referral';
  @attr('number') percentageOff!: number;

  @service declare time: TimeService;

  get isExpired() {
    // short-circuit, prevent re-computation
    if (this.expiresAt < new Date()) {
      return true;
    }

    return this.expiresAt < this.time.currentTime;
  }

  get isFromAffiliateReferral() {
    return this.type === 'affiliate_referral';
  }

  get isFromSignup() {
    return this.type === 'signup';
  }

  computeDiscountedPrice(price: number) {
    return price - (price * this.percentageOff) / 100;
  }
}
