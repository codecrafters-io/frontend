import Model, { attr, belongsTo } from '@ember-data/model';

export default class ReferralEarningsPayoutModel extends Model {
  @belongsTo('user', { async: false }) user;

  @attr('date') initiatedAt;
  @attr('date') completedAt;
  @attr('string') status; // 'processing', 'completed', 'failed'
  @attr('string') lastFailureReason;
  @attr('number') amountInCents;
  @attr('string') payoutMethodType; // 'paypal'
  @attr('') payoutMethodArgs;

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
