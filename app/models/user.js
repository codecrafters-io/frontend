import { attr, hasMany } from '@ember-data/model';
import Model from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') avatarUrl;
  @attr('date') createdAt;
  @attr('string') githubUsername;
  @attr('boolean') isAdmin;
  @attr('boolean') isStaff;
  @attr('string') username;
  @hasMany('course-language-request', { async: false }) courseLanguageRequests;
  @hasMany('feature-suggestion', { async: false }) featureSuggestions;
  @hasMany('repository', { async: false }) repositories;
  @hasMany('subscription', { async: false }) subscriptions;
  @hasMany('team-membership', { async: false }) teamMemberships;

  canCreateRepository(course, language) {
    if (language.isRust) {
      return true;
    } else {
      return this.hasActiveSubscription;
    }
  }

  get earlyBirdDiscountEligibilityExpiresAt() {
    return new Date(this.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);
  }

  get githubProfileUrl() {
    return `https://github.com/${this.githubUsername}`;
  }

  get hasActiveSubscription() {
    return this.subscriptions.isAny('isActive');
  }

  get isEligibleForEarlyBirdDiscount() {
    return this.earlyBirdDiscountEligibilityExpiresAt > new Date();
  }

  get isTeamAdmin() {
    return !!this.managedTeams.firstObject;
  }

  get isTeamMember() {
    return !!this.teams.firstObject;
  }

  get managedTeams() {
    return this.teamMemberships.filterBy('isAdmin').mapBy('team');
  }

  get teamHasActiveSubscription() {
    return this.teams.isAny('hasActiveSubscription');
  }

  get teams() {
    return this.teamMemberships.mapBy('team');
  }
}
