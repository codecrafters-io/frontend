import Model, { attr, belongsTo } from '@ember-data/model';
import UserModel from 'codecrafters-frontend/models/user';

export default class AffiliateEarningsPayoutModel extends Model {
  @belongsTo('user', { async: false, inverse: 'affiliateEarningsPayouts' }) declare user: UserModel;

  @attr('number') declare amountInCents: number;
  @attr('date') declare completedAt: Date | null;
  @attr('date') declare initiatedAt: Date;
  @attr('string') declare lastFailureReason: string;
  @attr() declare payoutMethodArgs: { [key: string]: string };
  @attr('string') declare payoutMethodType: string; // 'paypal'
  @attr('string') declare status: string; // 'processing', 'completed', 'failed'

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
