import config from 'codecrafters-frontend/config/environment';
import Model, { attr, hasMany } from '@ember-data/model';
import { collectionAction, memberAction } from 'ember-api-actions';
import { inject as service } from '@ember/service';

export default class UserModel extends Model {
  @service('feature-flags') featureFlagsService;

  @attr() authoredCourseSlugs;
  @attr('string') avatarUrl;
  @attr('date') createdAt;
  @attr('') featureFlags;
  @attr('string') githubUsername;
  @attr('boolean') isAdmin;
  @attr('boolean') isAffiliate;
  @attr('boolean') isConceptAuthor;
  @attr('boolean') isStaff;
  @attr('boolean') isVip;
  @attr('date') lastFreeUsageGrantExpiresAt;
  @attr('string') name;
  @attr('string') primaryEmailAddress;
  @attr('string') username;
  @attr('date') vipStatusExpiresAt;

  @hasMany('badge-awards', { async: false, inverse: 'user' }) badgeAwards;
  @hasMany('course-language-request', { async: false }) courseLanguageRequests;
  @hasMany('course-extension-idea-vote', { async: false }) courseExtensionIdeaVotes;
  @hasMany('course-idea-vote', { async: false }) courseIdeaVotes;
  @hasMany('course-participation', { async: false }) courseParticipations;
  @hasMany('feature-suggestion', { async: false }) featureSuggestions;
  @hasMany('github-app-installation', { async: false }) githubAppInstallations;
  @hasMany('affiliate-referral', { async: false, inverse: 'customer' }) affiliateReferralsAsCustomer;
  @hasMany('affiliate-referral', { async: false, inverse: 'referrer' }) affiliateReferralsAsReferrer;
  @hasMany('referral-earnings-payout', { async: false }) referralEarningsPayouts;
  @hasMany('affiliate-link', { async: false }) affiliateLinks;
  @hasMany('repository', { async: false }) repositories;
  @hasMany('subscription', { async: false }) subscriptions;
  @hasMany('team-membership', { async: false }) teamMemberships;
  @hasMany('user-profile-event', { async: false }) profileEvents;

  get activeSubscription() {
    return this.subscriptions.sortBy('startDate').reverse().findBy('isActive');
  }

  get adminProfileUrl() {
    return `${config.x.backendUrl}/admin/users/${this.id}`;
  }

  get canAccessPaidContent() {
    return this.isVip || this.hasActiveSubscription || this.teamHasActiveSubscription || this.teamHasActivePilot;
  }

  get codecraftersProfileUrl() {
    return `/users/${this.username}`;
  }

  get completedCourseParticipations() {
    return this.courseParticipations.filterBy('isCompleted');
  }

  get currentAffiliateReferral() {
    return this.affiliateReferralsAsCustomer.rejectBy('isNew').sortBy('createdAt').reverse().firstObject;
  }

  get earlyBirdDiscountEligibilityExpiresAt() {
    return new Date(this.createdAt.getTime() + 24 * 60 * 60 * 1000);
  }

  get expiredSubscription() {
    if (this.hasActiveSubscription) {
      return null;
    } else {
      return this.subscriptions.sortBy('startDate').reverse().findBy('isInactive');
    }
  }

  get githubAppInstallation() {
    return this.githubAppInstallations.firstObject;
  }

  get githubProfileUrl() {
    return `https://github.com/${this.githubUsername}`;
  }

  get hasActiveSubscription() {
    return !!this.activeSubscription;
  }

  get hasAuthoredCourses() {
    return this.authoredCourseSlugs.length > 0;
  }

  get hasEarnedThreeInADayBadge() {
    return this.badgeAwards.any((badgeAward) => badgeAward.badge.slug === 'three-in-a-day');
  }

  get hasJoinedAffiliateProgram() {
    return this.affiliateLinks.rejectBy('isNew').length > 0;
  }

  get isEligibleForEarlyBirdDiscount() {
    if (this.isEligibleForReferralDiscount) {
      return false; // Prioritize referral
    }

    return this.earlyBirdDiscountEligibilityExpiresAt > new Date();
  }

  get isEligibleForReferralDiscount() {
    if (this.currentAffiliateReferral) {
      return this.currentAffiliateReferral.isWithinDiscountPeriod;
    } else {
      return false;
    }
  }

  get isFree() {
    return !this.isPaid;
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

  canAttemptCourseStage(courseStage) {
    return courseStage.isFree || this.canAccessPaidContent;
  }

  canCreateRepository(/* _course, _language */) {
    // course & language are unused, earlier we used to limit access based on payment status
    return true;
  }

  hasStartedCourse(course) {
    return this.repositories.rejectBy('isNew').filterBy('course', course).length > 0;
  }

  isCourseAuthor(course) {
    return this.authoredCourseSlugs && this.authoredCourseSlugs.includes(course.slug);
  }
}

UserModel.prototype.syncFeatureFlags = memberAction({
  path: 'sync-feature-flags',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});

UserModel.prototype.fetchNextInvoicePreview = memberAction({
  path: 'next-invoice-preview',
  type: 'get',

  after(response) {
    if (response.data) {
      this.store.pushPayload(response);

      return this.store.peekRecord('invoice', response.data.id);
    } else {
      return null;
    }
  },
});

UserModel.prototype.fetchCurrent = collectionAction({
  path: 'current',
  type: 'get',
  urlType: 'findRecord',

  after(response) {
    if (response.data) {
      this.store.pushPayload(response);

      return this.store.peekRecord('user', response.data.id);
    } else {
      return null;
    }
  },
});
