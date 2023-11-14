import FreeUsageGrantModel from 'codecrafters-frontend/models/free-usage-grant';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { TemporaryUserModel } from 'codecrafters-frontend/lib/temporary-types';

export default class ReferralActivationModel extends Model {
  @belongsTo('user', { async: false, inverse: 'referralActivationsAsCustomer' }) customer!: TemporaryUserModel;
  @belongsTo('user', { async: false, inverse: 'referralActivationsAsReferrer' }) referrer!: TemporaryUserModel;
  @belongsTo('referral-link', { async: false }) referralLink!: ReferralLinkModel;

  @hasMany('free-usage-grants', { async: false }) freeUsageGrants!: FreeUsageGrantModel[];

  @attr('date') createdAt!: Date;
}
