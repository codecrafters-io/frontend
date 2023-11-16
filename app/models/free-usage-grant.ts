import Model, { attr, belongsTo } from '@ember-data/model';
import ReferralActivationModel from 'codecrafters-frontend/models/referral-activation';
import { TemporaryUserModel } from 'codecrafters-frontend/lib/temporary-types';

export default class FreeUsageGrantModel extends Model {
  @belongsTo('referral-activation', { async: false }) referralActivation!: ReferralActivationModel;
  @belongsTo('user', { async: false }) user!: TemporaryUserModel;

  @attr('date') activatesAt!: Date;
  @attr('date') expiresAt!: Date;
  @attr('string') sourceType!: string;
}
