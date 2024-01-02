import Model, { attr, belongsTo } from '@ember-data/model';
import ReferralActivationModel from 'codecrafters-frontend/models/referral-activation';
import UserModel from 'codecrafters-frontend/models/user';

export default class FreeUsageGrantModel extends Model {
  @belongsTo('referral-activation', { async: false }) referralActivation!: ReferralActivationModel;
  @belongsTo('user', { async: false, inverse: null }) user!: UserModel;

  @attr('date') activatesAt!: Date;
  @attr('date') expiresAt!: Date;
  @attr('string') sourceType!: string;

  get isExpired() {
    return this.expiresAt < new Date();
  }
}
