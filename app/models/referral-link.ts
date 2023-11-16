import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { TemporaryUserModel } from 'codecrafters-frontend/lib/temporary-types';
import ReferralActivationModel from 'codecrafters-frontend/models/referral-activation';

export default class ReferralLinkModel extends Model {
  @belongsTo('user', { async: false }) user!: TemporaryUserModel;

  @hasMany('referral-activations', { async: false }) activations!: ReferralActivationModel[];

  @attr('string') slug!: string;
  @attr('string') url!: string;
}
