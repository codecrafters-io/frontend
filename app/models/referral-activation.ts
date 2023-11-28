import Model, { attr, belongsTo } from '@ember-data/model';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import UserModel from 'codecrafters-frontend/models/user';

export default class ReferralActivationModel extends Model {
  @belongsTo('user', { async: false, inverse: 'referralActivationsAsCustomer' }) customer!: UserModel;
  @belongsTo('user', { async: false, inverse: 'referralActivationsAsReferrer' }) referrer!: UserModel;
  @belongsTo('referral-link', { async: false }) referralLink!: ReferralLinkModel;

  @attr('date') createdAt!: Date;
}
