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
  @attr('string') type!: 'signup' | 'affiliate_referral' | 'stage_2_completion' | 'membership_expiry';
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

  get isFromMembershipExpiry() {
    return this.type === 'membership_expiry';
  }

  get isFromSignup() {
    return this.type === 'signup';
  }

  get isFromStage2Completion() {
    return this.type === 'stage_2_completion';
  }

  computeDiscountedPrice(price: number) {
    return price - (price * this.percentageOff) / 100;
  }
}
