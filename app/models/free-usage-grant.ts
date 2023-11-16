import Model, { attr, belongsTo } from '@ember-data/model';
import ReferralActivationModel from 'codecrafters-frontend/models/referral-activation';
import { TemporaryUserModel } from 'codecrafters-frontend/lib/temporary-types';

export default class FreeUsageGrantModel extends Model {
  @belongsTo('referral-activation', { async: false, optional: true }) referralActivation!: ReferralActivationModel;
  @belongsTo('user', { async: false }) user!: TemporaryUserModel;

  @attr('boolean') active?: boolean;
  @attr('date') activatesAt!: Date;
  @attr('date') expiresAt!: Date;
  @attr('string') sourceType!: string;
}
