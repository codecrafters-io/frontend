import Model, { attr, belongsTo } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';
import type UserModel from 'codecrafters-frontend/models/user';

export default class MembershipGiftModel extends Model {
  @belongsTo('user', { async: false, inverse: null }) declare claimant: UserModel;
  @belongsTo('user', { async: false, inverse: null }) declare sender: UserModel;

  @attr('date') declare purchasedAt: Date;
  @attr('date') declare redeemedAt: Date | null;
  @attr('string') declare secretToken: string;
  @attr('string') declare senderMessage: string;
  @attr('number') declare validityInDays: number;

  declare redeem: (this: MembershipGiftModel, payload: unknown) => Promise<void>;

  get redeemUrl(): string {
    return `${window.location.origin}/gifts/redeem/${this.secretToken}`;
  }
}

MembershipGiftModel.prototype.redeem = memberAction({
  path: 'redeem',
  type: 'post',
});
