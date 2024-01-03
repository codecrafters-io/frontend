import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';

export default class SubscriptionModel extends Model {
  @belongsTo('user', { async: false, inverse: 'subscriptions' }) user;
  @attr('date') cancelAt;
  @attr('date') currentPeriodEnd;
  @attr('date') endedAt;
  @attr('date') startDate;
  @attr('string') pricingPlanName;
  @attr('date') trialEnd;

  get isActive() {
    return !this.endedAt && !this.isNew;
  }

  get isInactive() {
    return this.endedAt;
  }

  get isTrialing() {
    return this.isActive && this.trialEnd && new Date() < this.trialEnd;
  }
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
