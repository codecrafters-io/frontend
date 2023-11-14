import Model, { attr, belongsTo } from '@ember-data/model';
import { TemporaryUserModel } from 'codecrafters-frontend/lib/temporary-types';
import ReferralActivationModel from 'codecrafters-frontend/models/referral-activation';

export default class FreeUsageGrantModel extends Model {
  @belongsTo('referral-activation', { async: false, optional: true }) referralActivation!: ReferralActivationModel;
  @belongsTo('user', { async: false }) user!: TemporaryUserModel;

  @attr('date') activatesAt!: Date;
  @attr('string') sourceType!: string;
  @attr('number') validityInHours!: number;

  get expiresAt(): Date {
    return new Date(this.activatesAt.getTime() + this.validityInHours * 60 * 60 * 1000);
  }

  get isActive(): boolean {
    return this.activatesAt < new Date();
  }

  get isExpired(): boolean {
    return !this.isActive;
  }
}
