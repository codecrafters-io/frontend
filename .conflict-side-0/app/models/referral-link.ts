import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import ReferralActivationModel from 'codecrafters-frontend/models/referral-activation';
import UserModel from 'codecrafters-frontend/models/user';

export default class ReferralLinkModel extends Model {
  @belongsTo('user', { async: false, inverse: 'referralLinks' }) user!: UserModel;

  @hasMany('referral-activation', { async: false, inverse: 'referralLink' }) activations!: ReferralActivationModel[];

  @attr('string') slug!: string;
  @attr('string') url!: string;
}
