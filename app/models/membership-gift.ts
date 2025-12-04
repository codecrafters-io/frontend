import Model, { attr, belongsTo } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';
import type UserModel from 'codecrafters-frontend/models/user';

export default class MembershipGiftModel extends Model {
  @belongsTo('user', { async: false, inverse: null }) declare claimant: UserModel;
  @belongsTo('user', { async: false, inverse: null }) declare sender: UserModel;

  @attr('date') declare claimedAt: Date | null;
  @attr('date') declare purchasedAt: Date;
  @attr('string') declare senderMessage: string;
  @attr('number') declare validityInDays: number;
  @attr('string') declare secretToken: string;

  declare redeem: (this: MembershipGiftModel, payload: unknown) => Promise<void>;
}

MembershipGiftModel.prototype.redeem = memberAction({
  path: 'redeem',
  type: 'post',
});
