import Model, { attr, belongsTo } from '@ember-data/model';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import { TemporaryUserModel } from 'codecrafters-frontend/lib/temporary-types';

export default class ReferralActivationModel extends Model {
  @belongsTo('user', { async: false, inverse: 'referralActivationsAsCustomer' }) customer!: TemporaryUserModel;
  @belongsTo('user', { async: false, inverse: 'referralActivationsAsReferrer' }) referrer!: TemporaryUserModel;
  @belongsTo('referral-link', { async: false }) referralLink!: ReferralLinkModel;

  @attr('date') createdAt!: Date;
}
