import Model, { attr, belongsTo } from '@ember-data/model';
import { TemporaryUserModel } from 'codecrafters-frontend/lib/temporary-types';
import ReferralActivationModel from 'codecrafters-frontend/models/referral-activation';

export default class FreeUsageGrantModel extends Model {
  @belongsTo('referral-activation', { async: false }) referralActivation!: ReferralActivationModel;
  @belongsTo('user', { async: false }) user!: TemporaryUserModel;

  @attr('date') activatesAt!: Date;
  @attr('boolean') active!: boolean;
  @attr('date') expiresAt!: Date;
  @attr('string') sourceType!: string;
}
