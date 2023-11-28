import AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';
import AffiliateReferralModel from 'codecrafters-frontend/models/affiliate-referral';
import BadgeAwardModel from 'codecrafters-frontend/models/badge-award';
import config from 'codecrafters-frontend/config/environment';
import CourseExtensionIdeaVoteModel from 'codecrafters-frontend/models/course-extension-idea-vote';
import CourseIdeaVoteModel from 'codecrafters-frontend/models/course-idea-vote';
import CourseLanguageRequestModel from 'codecrafters-frontend/models/course-language-request';
import CourseModel from 'codecrafters-frontend/models/course';
import CourseParticipationModel from 'codecrafters-frontend/models/course-participation';
import FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import FeatureSuggestionModel from 'codecrafters-frontend/models/feature-suggestion';
import GitHubAppInstallationModel from 'codecrafters-frontend/models/github-app-installation';
import Model, { attr, hasMany } from '@ember-data/model';
import ReferralActivationModel from 'codecrafters-frontend/models/referral-activation';
import ReferralEarningsPayoutModel from 'codecrafters-frontend/models/referral-earnings-payout';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import SubscriptionModel from 'codecrafters-frontend/models/subscription';
import TeamMembershipModel from 'codecrafters-frontend/models/team-membership';
import { TemporaryCourseStageModel } from 'codecrafters-frontend/lib/temporary-types';
import UserProfileEventModel from 'codecrafters-frontend/models/user-profile-event';
import { collectionAction, memberAction } from 'ember-api-actions';
import { inject as service } from '@ember/service';

export default class UserModel extends Model {
  @service('feature-flags') featureFlagsService!: FeatureFlagsService;

  @attr() authoredCourseSlugs!: string[];
  @attr('string') avatarUrl!: string;
  @attr('date') createdAt!: Date;
  @attr() featureFlags!: { [key: string]: string };
  @attr('string') githubUsername!: string;
  @attr('boolean') hasActiveFreeUsageGrants!: boolean;
  @attr('boolean') isAdmin!: boolean;
  @attr('boolean') isAffiliate!: boolean;
  @attr('boolean') isConceptAuthor!: boolean;
  @attr('boolean') isStaff!: boolean;
  @attr('boolean') isVip!: boolean;
  @attr('date') lastFreeUsageGrantExpiresAt!: Date | null;
  @attr('string') name!: string;
  @attr('string') primaryEmailAddress!: string;
  @attr('string') username!: string;
  @attr('date') vipStatusExpiresAt!: Date | null;

  @hasMany('affiliate-link', { async: false }) affiliateLinks!: AffiliateLinkModel[];
  @hasMany('affiliate-referral', { async: false, inverse: 'customer' }) affiliateReferralsAsCustomer!: AffiliateReferralModel[];
  @hasMany('affiliate-referral', { async: false, inverse: 'referrer' }) affiliateReferralsAsReferrer!: AffiliateReferralModel[];
  @hasMany('badge-awards', { async: false, inverse: 'user' }) badgeAwards!: BadgeAwardModel[];
  @hasMany('course-language-request', { async: false }) courseLanguageRequests!: CourseLanguageRequestModel[];
  @hasMany('course-extension-idea-vote', { async: false }) courseExtensionIdeaVotes!: CourseExtensionIdeaVoteModel[];
  @hasMany('course-idea-vote', { async: false }) courseIdeaVotes!: CourseIdeaVoteModel[];
  @hasMany('course-participation', { async: false }) courseParticipations!: CourseParticipationModel[];
  @hasMany('feature-suggestion', { async: false }) featureSuggestions!: FeatureSuggestionModel[];
  @hasMany('github-app-installation', { async: false }) githubAppInstallations!: GitHubAppInstallationModel[];
  @hasMany('referral-activation', { async: false, inverse: 'customer' }) referralActivationsAsCustomer!: ReferralActivationModel[];
  @hasMany('referral-activation', { async: false, inverse: 'referrer' }) referralActivationsAsReferrer!: ReferralActivationModel[];
  @hasMany('referral-earnings-payout', { async: false }) referralEarningsPayouts!: ReferralEarningsPayoutModel[];
  @hasMany('referral-link', { async: false }) referralLinks!: ReferralLinkModel[];
  @hasMany('repository', { async: false }) repositories!: RepositoryModel[];
  @hasMany('subscription', { async: false }) subscriptions!: SubscriptionModel[];
  @hasMany('team-membership', { async: false }) teamMemberships!: TeamMembershipModel[];
  @hasMany('user-profile-event', { async: false }) profileEvents!: UserProfileEventModel[];

  get activeSubscription() {
    return this.subscriptions.sortBy('startDate').reverse().findBy('isActive');
  }

  get adminProfileUrl() {
    return `${config.x.backendUrl}/admin/users/${this.id}`;
  }

  get canAccessPaidContent() {
    return this.isVip || this.hasActiveSubscription || this.teamHasActiveSubscription || this.teamHasActivePilot || this.hasActiveFreeUsageGrants;
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

  get hasActiveFreeUsageGrantsValueIsOutdated() {
    if (!this.lastFreeUsageGrantExpiresAt) {
      return false;
    }

    return this.lastFreeUsageGrantExpiresAt < new Date();
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

  get hasJoinedReferralProgram() {
    return this.referralLinks.rejectBy('isNew').length > 0;
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

  canAttemptCourseStage(courseStage: TemporaryCourseStageModel) {
    return courseStage.isFree || this.canAccessPaidContent;
  }

  canCreateRepository(/* _course, _language */) {
    // course & language are unused, earlier we used to limit access based on payment status
    return true;
  }

  hasStartedCourse(course: CourseModel) {
    return this.repositories.rejectBy('isNew').filterBy('course', course).length > 0;
  }

  isCourseAuthor(course: CourseModel) {
    return this.authoredCourseSlugs && this.authoredCourseSlugs.includes(course.slug);
  }

  declare fetchCurrent: (this: Model, payload: unknown) => Promise<Model | null>;
  declare fetchNextInvoicePreview: (this: Model, payload: unknown) => Promise<void>;
  declare syncFeatureFlags: (this: Model, payload: unknown) => Promise<void>;
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
