import Model, { attr, belongsTo } from '@ember-data/model';
import type UserModel from 'codecrafters-frontend/models/user';
import type InstitutionMembershipGrantModel from './institution-membership-grant';

export default class SubscriptionModel extends Model {
  @attr('number') declare baseValidityInDays: number;
  @attr('date') declare cancelAt: Date;
  @attr('date') declare endedAt: Date | null;
  @attr('number') declare rolloverValidityInDays: number;
  @attr('date') declare startedAt: Date;

  // TODO(CC-1888): Add other sources
  @belongsTo('subscription-source', { async: false, inverse: null, polymorphic: true }) declare source: InstitutionMembershipGrantModel;
  @belongsTo('user', { async: false, inverse: 'subscriptions' }) declare user: UserModel;

  get hasRolloverValidity(): boolean {
    return this.rolloverValidityInDays > 0;
  }

  get isActive() {
    return !this.endedAt && !this.isNew;
  }

  get isInactive() {
    return this.endedAt;
  }

  // A lifetime membership is modeled as 100 year expiry, we check for 50 here to be safe
  get isLifetimeMembership(): boolean {
    return this.cancelAt >= new Date(Date.now() + 50 * 365 * 24 * 60 * 60 * 1000); // 50 years from now
  }
}
