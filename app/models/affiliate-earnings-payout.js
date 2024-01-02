import Model, { attr, belongsTo } from '@ember-data/model';

export default class AffiliateEarningsPayoutModel extends Model {
  @belongsTo('user', { async: false, inverse: 'affiliateEarningsPayouts' }) user;

  @attr('number') amountInCents;
  @attr('date') completedAt;
  @attr('date') initiatedAt;
  @attr('string') lastFailureReason;
  @attr('') payoutMethodArgs;
  @attr('string') payoutMethodType; // 'paypal'
  @attr('string') status; // 'processing', 'completed', 'failed'

  get amountInDollars() {
    return this.amountInCents / 100;
  }

  get statusIsCompleted() {
    return this.status === 'completed';
  }

  get statusIsFailed() {
    return this.status === 'failed';
  }

  get statusIsProcessing() {
    return this.status === 'processing';
  }
}
