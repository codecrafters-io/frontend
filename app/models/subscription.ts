import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';

import type UserModel from 'codecrafters-frontend/models/user';

export default class SubscriptionModel extends Model {
  @attr('date') declare cancelAt: Date;
  @attr('date') declare currentPeriodEnd: Date;
  @attr('date') declare endedAt: Date | null;
  @attr('string') declare pricingPlanName: string;
  @attr('date') declare startDate: Date;
  @attr('date') declare trialEnd: Date;

  @belongsTo('user', { async: false, inverse: 'subscriptions' }) declare user: UserModel;

  get isActive() {
    return !this.endedAt && !this.isNew;
  }

  get isInactive() {
    return this.endedAt;
  }

  get isTrialing() {
    return this.isActive && this.trialEnd && new Date() < this.trialEnd;
  }

  declare cancel: (this: Model, payload: unknown) => Promise<void>;
  declare cancelTrial: (this: Model, payload: unknown) => Promise<void>;
}

SubscriptionModel.prototype.cancelTrial = memberAction({
  path: 'cancel-trial',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});

SubscriptionModel.prototype.cancel = memberAction({
  path: 'cancel',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});
