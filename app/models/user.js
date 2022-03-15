import { attr, hasMany } from '@ember-data/model';
import Model from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') avatarUrl;
  @attr('date') createdAt;
  @attr('string') githubUsername;
  @attr('boolean') isAdmin;
  @attr('boolean') isStaff;
  @attr('string') username;
  @hasMany('free-usage-restriction', { async: false }) freeUsageRestrictions;
  @hasMany('repository', { async: false }) repositories;
  @hasMany('subscription', { async: false }) subscriptions;
  @hasMany('team-membership', { async: false }) teamMemberships;

  get freeUsageRestrictionIsActive() {
    return this.freeUsageRestrictions.sortBy('expiresAt').lastObject && this.freeUsageRestrictions.sortBy('expiresAt').lastObject.isActive;
  }

  get githubProfileUrl() {
    return `https://github.com/${this.githubUsername}`;
  }

  get hasActiveSubscription() {
    return this.subscriptions.isAny('isActive');
  }

  get isTeamAdmin() {
    return !!this.managedTeams.firstObject;
  }

  get managedTeams() {
    return this.teamMemberships.filterBy('isAdmin').mapBy('team');
  }

  get teams() {
    return this.teamMemberships.mapBy('team');
  }
}
