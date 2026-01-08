import Model, { attr, belongsTo } from '@ember-data/model';
import type UserModel from 'codecrafters-frontend/models/user';
import type InstitutionMembershipGrantModel from './institution-membership-grant';

export default class SubscriptionModel extends Model {
  @attr('date') declare cancelAt: Date;
  @attr('date') declare endedAt: Date | null;
  @attr('date') declare startedAt: Date;

  // TODO(CC-1888): Add other sources
  @belongsTo('subscription-source', { async: false, inverse: null, polymorphic: true }) declare source: InstitutionMembershipGrantModel;
  @belongsTo('user', { async: false, inverse: 'subscriptions' }) declare user: UserModel;

  get isActive() {
    return !this.endedAt && !this.isNew;
  }

  get isInactive() {
    return this.endedAt;
  }
}
