import AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';
import AffiliateReferralModel from 'codecrafters-frontend/models/affiliate-referral';
import BadgeAwardModel from 'codecrafters-frontend/models/badge-award';
import ConceptEngagementModel from 'codecrafters-frontend/models/concept-engagement';
import config from 'codecrafters-frontend/config/environment';
import CourseExtensionIdeaVoteModel from 'codecrafters-frontend/models/course-extension-idea-vote';
import CourseIdeaVoteModel from 'codecrafters-frontend/models/course-idea-vote';
import CourseLanguageRequestModel from 'codecrafters-frontend/models/course-language-request';
import CourseModel from 'codecrafters-frontend/models/course';
import CourseParticipationModel from 'codecrafters-frontend/models/course-participation';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import FeatureSuggestionModel from 'codecrafters-frontend/models/feature-suggestion';
import GitHubAppInstallationModel from 'codecrafters-frontend/models/github-app-installation';
import InvoiceModel from 'codecrafters-frontend/models/invoice';
import Model, { attr, hasMany } from '@ember-data/model';
import ReferralActivationModel from 'codecrafters-frontend/models/referral-activation';
import AffiliateEarningsPayoutModel from 'codecrafters-frontend/models/affiliate-earnings-payout';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import SubscriptionModel from 'codecrafters-frontend/models/subscription';
import TeamMembershipModel from 'codecrafters-frontend/models/team-membership';
import UserProfileEventModel from 'codecrafters-frontend/models/user-profile-event';
import { collectionAction, memberAction } from 'ember-api-actions';
import { inject as service } from '@ember/service';

export default class UserModel extends Model {
  @service('feature-flags') featureFlagsService!: FeatureFlagsService;

  @attr() declare authoredCourseSlugs: string[];
  @attr('string') declare avatarUrl: string;
  @attr('date') declare createdAt: Date;
  @attr() declare featureFlags: { [key: string]: string };
  @attr('string') declare githubUsername: string;
  @attr('boolean') declare hasActiveFreeUsageGrants: boolean;
  @attr('boolean') declare hasAnonymousModeEnabled: boolean;
  @attr('boolean') declare isAdmin: boolean;
  @attr('boolean') declare isAffiliate: boolean;
  @attr('boolean') declare isConceptAuthor: boolean;
  @attr('boolean') declare isStaff: boolean;
  @attr('boolean') declare isVip: boolean;
  @attr('date') declare lastFreeUsageGrantExpiresAt: Date | null;
  @attr('string') declare name: string;
  @attr('string') declare primaryEmailAddress: string;
  @attr('string') declare profileDescriptionMarkdown: string;
  @attr('string') declare username: string;
  @attr('date') declare vipStatusExpiresAt: Date | null;

  @hasMany('affiliate-link', { async: false, inverse: 'user' }) affiliateLinks!: AffiliateLinkModel[];
  @hasMany('affiliate-referral', { async: false, inverse: 'customer' }) affiliateReferralsAsCustomer!: AffiliateReferralModel[];
  @hasMany('affiliate-referral', { async: false, inverse: 'referrer' }) affiliateReferralsAsReferrer!: AffiliateReferralModel[];
  @hasMany('badge-award', { async: false, inverse: 'user' }) badgeAwards!: BadgeAwardModel[];
  @hasMany('concept-engagement', { async: false, inverse: 'user' }) conceptEngagements!: ConceptEngagementModel[];
  @hasMany('course-language-request', { async: false, inverse: 'user' }) courseLanguageRequests!: CourseLanguageRequestModel[];
  @hasMany('course-extension-idea-vote', { async: false, inverse: 'user' }) courseExtensionIdeaVotes!: CourseExtensionIdeaVoteModel[];
  @hasMany('course-idea-vote', { async: false, inverse: 'user' }) courseIdeaVotes!: CourseIdeaVoteModel[];
  @hasMany('course-participation', { async: false, inverse: 'user' }) courseParticipations!: CourseParticipationModel[];
  @hasMany('feature-suggestion', { async: false, inverse: 'user' }) featureSuggestions!: FeatureSuggestionModel[];
  @hasMany('github-app-installation', { async: false, inverse: 'user' }) githubAppInstallations!: GitHubAppInstallationModel[];
  @hasMany('referral-activation', { async: false, inverse: 'customer' }) referralActivationsAsCustomer!: ReferralActivationModel[];
  @hasMany('referral-activation', { async: false, inverse: 'referrer' }) referralActivationsAsReferrer!: ReferralActivationModel[];
  @hasMany('affiliate-earnings-payout', { async: false, inverse: 'user' }) affiliateEarningsPayouts!: AffiliateEarningsPayoutModel[];
  @hasMany('referral-link', { async: false, inverse: 'user' }) referralLinks!: ReferralLinkModel[];
  @hasMany('repository', { async: false, inverse: 'user' }) repositories!: RepositoryModel[];
  @hasMany('subscription', { async: false, inverse: 'user' }) subscriptions!: SubscriptionModel[];
  @hasMany('team-membership', { async: false, inverse: 'user' }) teamMemberships!: TeamMembershipModel[];
  @hasMany('user-profile-event', { async: false, inverse: 'user' }) profileEvents!: UserProfileEventModel[];

  get activeSubscription() {
    return this.subscriptions.sortBy('startDate').reverse().findBy('isActive');
  }

  get adminProfileUrl() {
    return `${config.x.backendUrl}/admin/users/${this.id}`;
  }

  get canAccessMembershipBenefits() {
    return this.isVip || this.hasActiveSubscription || this.teamHasActiveSubscription || this.teamHasActivePilot;
  }

  get canAccessPaidContent() {
    return this.canAccessMembershipBenefits || this.hasActiveFreeUsageGrants;
  }

  get codecraftersProfileUrl() {
    return `/users/${this.username}`;
  }

  get completedCourseParticipations() {
    return this.courseParticipations.filterBy('isCompleted');
  }

  get currentAffiliateReferral() {
    return this.affiliateReferralsAsCustomer.rejectBy('isNew').sortBy('createdAt').reverse()[0];
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
    return this.githubAppInstallations[0];
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
    return !!this.managedTeams[0];
  }

  get isTeamMember() {
    return !!this.teams[0];
  }

  get languagesFromCompletedCourseParticipations() {
    return this.completedCourseParticipations.mapBy('language').uniq();
  }

  get managedTeams() {
    return this.teamMemberships.filterBy('isAdmin').mapBy('team');
  }

  get pendingProductWalkthroughFeatureSuggestion(): FeatureSuggestionModel | null {
    return this.featureSuggestions.filterBy('featureIsProductWalkthrough').rejectBy('isDismissed')[0] || null;
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

  canAttemptCourseStage(courseStage: CourseStageModel) {
    return courseStage.isFree || courseStage.course.isFree || this.canAccessPaidContent;
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

  declare fetchCurrent: (this: Model, payload: unknown) => Promise<UserModel | null>;
  declare fetchNextInvoicePreview: (this: Model, payload: unknown) => Promise<InvoiceModel | null>;
  declare syncFeatureFlags: (this: Model, payload: unknown) => Promise<void>;
  declare syncUsernameFromGitHub: (this: Model, payload: unknown) => Promise<void>;
}

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

UserModel.prototype.syncFeatureFlags = memberAction({
  path: 'sync-feature-flags',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});

UserModel.prototype.syncUsernameFromGitHub = memberAction({
  path: 'sync-username-from-github',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});
