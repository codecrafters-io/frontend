import Model, { attr, belongsTo } from '@ember-data/model';
import type UserModel from 'codecrafters-frontend/models/user';

export default class SubscriptionModel extends Model {
  @attr('date') declare cancelAt: Date;
  @attr('date') declare currentPeriodEnd: Date;
  @attr('date') declare endedAt: Date | null;
  @attr('date') declare startDate: Date;

  @belongsTo('user', { async: false, inverse: 'subscriptions' }) declare user: UserModel;

  get isActive() {
    return !this.endedAt && !this.isNew;
  }

  get isInactive() {
    return this.endedAt;
  }
}
