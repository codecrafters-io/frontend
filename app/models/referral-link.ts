import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import ReferralActivationModel from 'codecrafters-frontend/models/referral-activation';
import { TemporaryUserModel } from 'codecrafters-frontend/lib/temporary-types';

export default class ReferralLinkModel extends Model {
  @belongsTo('user', { async: false }) user!: TemporaryUserModel;

  @hasMany('referral-activation', { async: false }) activations!: ReferralActivationModel[];

  @attr('string') slug!: string;
  @attr('string') url!: string;
}
