import { attr, hasMany } from '@ember-data/model';
import Model from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') avatarUrl;
  @attr('date') createdAt;
  @attr('string') githubUsername;
  @attr('boolean') isAdmin;
  @attr('boolean') isStaff;
  @attr('boolean') isCodecraftersPartner;
  @attr('string') name;
  @attr('string') username;

  @hasMany('course-language-request', { async: false }) courseLanguageRequests;
  @hasMany('course-extension-idea-vote', { async: false }) courseExtensionIdeaVotes;
  @hasMany('course-extension-idea-supervote', { async: false }) courseExtensionIdeaSupervotes;
  @hasMany('course-extension-idea-supervote-grants', { async: false }) courseExtensionIdeaSupervoteGrants;
  @hasMany('course-idea-vote', { async: false }) courseIdeaVotes;
  @hasMany('course-idea-supervote', { async: false }) courseIdeaSupervotes;
  @hasMany('course-idea-supervote-grants', { async: false }) courseIdeaSupervoteGrants;
  @hasMany('course-participation', { async: false }) courseParticipations;
  @hasMany('feature-suggestion', { async: false }) featureSuggestions;
  @hasMany('repository', { async: false }) repositories;
  @hasMany('subscription', { async: false }) subscriptions;
  @hasMany('team-membership', { async: false }) teamMemberships;
  @hasMany('user-profile-event', { async: false }) profileEvents;

  get activeSubscription() {
    return this.subscriptions.sortBy('startDate').reverse().findBy('isActive');
  }

  get availableCourseIdeaSupervotes() {
    return this.courseIdeaSupervoteGrants.mapBy('numberOfSupervotes').reduce((a, b) => a + b, 0) - this.courseIdeaSupervotes.length;
  }

  get canAccessPaidContent() {
    return this.isCodecraftersPartner || this.hasActiveSubscription || this.teamHasActiveSubscription || this.teamHasActivePilot;
  }

  get completedCourseParticipations() {
    return this.courseParticipations.filterBy('isCompleted');
  }

  get expiredSubscription() {
    if (this.hasActiveSubscription) {
      return null;
    } else {
      return this.subscriptions.sortBy('startDate').reverse().findBy('isInactive');
    }
  }

  canCreateRepository(course, language) {
    if (language.isRust) {
      return true;
    } else {
      return this.canAccessPaidContent;
    }
  }

  get codecraftersProfileUrl() {
    return `/users/${this.username}`;
  }

  get earlyBirdDiscountEligibilityExpiresAt() {
    return new Date(this.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);
  }

  get githubProfileUrl() {
    return `https://github.com/${this.githubUsername}`;
  }

  get hasActiveSubscription() {
    return !!this.activeSubscription;
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

  get languagesFromCompletedCourseParticipations() {
    return this.completedCourseParticipations.mapBy('language').uniq();
  }

  get managedTeams() {
    return this.teamMemberships.filterBy('isAdmin').mapBy('team');
  }

  get teamHasActivePilot() {
    return this.teams.isAny('hasActivePilot');
  }

  get teamHasActiveSubscription() {
    return this.teams.isAny('hasActiveSubscription');
  }

  get teams() {
    return this.teamMemberships.mapBy('team');
  }
}
