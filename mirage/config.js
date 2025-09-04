import affiliateEarningsPayouts from './handlers/affiliate-earnings-payouts';
import affiliateLinks from './handlers/affiliate-links';
import affiliateReferrals from './handlers/affiliate-referrals';
import analyticsEvents from './handlers/analytics-events';
import autofixRequests from './handlers/autofix-requests';
import badges from './handlers/badges';
import charges from './handlers/charges';
import codeWalkthroughs from './handlers/code-walkthroughs';
import communityCourseStageSolutionComments from './handlers/community-course-stage-solution-comments';
import communityCourseStageSolutions from './handlers/community-course-stage-solutions';
import communitySolutionEvaluations from './handlers/community-solution-evaluations';
import communitySolutionEvaluators from './handlers/community-solution-evaluators';
import communitySolutionExports from './handlers/community-solution-exports';
import communitySolutionsAnalyses from './handlers/community-solutions-analyses';
import conceptEngagements from './handlers/concept-engagements';
import conceptGroups from './handlers/concept-groups';
import conceptQuestions from './handlers/concept-questions';
import concepts from './handlers/concepts';
import config from 'codecrafters-frontend/config/environment';
import contests from './handlers/contests';
import courseDefinitionUpdates from './handlers/course-definition-updates';
import courseExtensionActivations from './handlers/course-extension-activations';
import courseExtensionIdeas from './handlers/course-extension-ideas';
import courseIdeas from './handlers/course-ideas';
import courseLanguageRequests from './handlers/course-language-requests';
import courseLeaderboardEntries from './handlers/course-leaderboard-entries';
import courseStageComments from './handlers/course-stage-comments';
import courseStageCompletions from './handlers/course-stage-completions';
import courseStageFeedbackSubmissions from './handlers/course-stage-feedback-submissions';
import courseStageLanguageGuides from './handlers/course-stage-language-guides';
import courseTesterVersions from './handlers/course-tester-versions';
import courses from './handlers/courses';
import downvotes from './handlers/downvotes';
import emailAddresses from './handlers/email-addresses';
import fakeSubmissionLogs from './handlers/fake-submission-logs';
import featureSuggestions from './handlers/feature-suggestions';
import freeUsageGrants from './handlers/free-usage-grants';
import githubAppInstallations from './handlers/github-app-installations';
import githubRepositorySyncConfigurations from './handlers/github-repository-sync-configurations';
import individualCheckoutSessions from './handlers/individual-checkout-sessions';
import individualPaymentMethodUpdateRequests from './handlers/individual-payment-method-update-requests';
import institutionMembershipGrantApplications from './handlers/institution-membership-grant-applications';
import institutions from './handlers/institutions';
import languages from './handlers/languages';
import leaderboardEntries from './handlers/leaderboard-entries';
import leaderboardRankCalculations from './handlers/leaderboard-rank-calculations';
import logstreams from './handlers/logstreams';
import onboardingSurveys from './handlers/onboarding-surveys';
import perks from './handlers/perks';
import promotionalDiscounts from './handlers/promotional-discounts';
import referralActivations from './handlers/referral-activations';
import referralLinks from './handlers/referral-links';
import regionalDiscounts from './handlers/regional-discounts';
import repositories from './handlers/repositories';
import sessions from './handlers/sessions';
import siteFeedbackSubmissions from './handlers/site-feedback-submissions';
import slackIntegrations from './handlers/slack-integrations';
import solutionComparisons from './handlers/solution-comparisons';
import submissions from './handlers/submissions';
import subscriptions from './handlers/subscriptions';
import teamMemberships from './handlers/team-memberships';
import teamPaymentFlows from './handlers/team-payment-flows';
import teamPaymentMethodUpdateRequests from './handlers/team-payment-method-update-requests';
import teamSubscriptions from './handlers/team-subscriptions';
import teams from './handlers/teams';
import trackLeaderboardEntries from './handlers/track-leaderboard-entries';
import trustedCommunitySolutionEvaluations from './handlers/trusted-community-solution-evaluations';
import upvotes from './handlers/upvotes';
import users from './handlers/users';
import views from './handlers/views';
import { Model, belongsTo, createServer, hasMany } from 'miragejs';
import { applyEmberDataSerializers, discoverEmberDataModels } from 'ember-cli-mirage';

export default function (config) {
  let finalConfig = {
    ...config,
    models: {
      ...discoverEmberDataModels(config.store),
      ...config.models,
      ...{
        courseStageComment: Model.extend({
          user: belongsTo('user', { inverse: null }),
          target: belongsTo('course-stage', { inverse: 'comments' }),
          language: belongsTo('language', { inverse: null }),
          currentUserDownvotes: hasMany('downvote', { inverse: 'downvotable' }),
          currentUserUpvotes: hasMany('upvote', { inverse: 'upvotable' }),
          parentComment: belongsTo('course-stage-comment', { inverse: null }),
        }),
        communityCourseStageSolution: Model.extend({
          comments: hasMany('community-course-stage-solution-comment', { inverse: 'target' }),
          courseStage: belongsTo('course-stage', { inverse: 'communitySolutions' }),
          currentUserDownvotes: hasMany('downvote', { inverse: 'downvotable' }),
          currentUserUpvotes: hasMany('upvote', { inverse: 'upvotable' }),
          evaluations: hasMany('community-solution-evaluation', { inverse: 'communitySolution' }),
          exports: hasMany('community-solution-export', { inverse: 'communitySolution' }),
          language: belongsTo('language', { inverse: null }),
          screencasts: hasMany('course-stage-screencast', { inverse: 'solution' }),
          trustedEvaluations: hasMany('trusted-community-solution-evaluation', { inverse: 'communitySolution' }),
          user: belongsTo('user', { inverse: null }),
        }),
        communityCourseStageSolutionComment: Model.extend({
          user: belongsTo('user', { inverse: null }),
          target: belongsTo('community-course-stage-solution', { inverse: 'comments' }),
          language: belongsTo('language', { inverse: null }),
          currentUserDownvotes: hasMany('downvote', { inverse: 'downvotable' }),
          currentUserUpvotes: hasMany('upvote', { inverse: 'upvotable' }),
          parentComment: belongsTo('community-course-stage-solution-comment', { inverse: null }),
        }),
        fakeLogstream: Model.extend({}),
      },
    },
    serializers: applyEmberDataSerializers(config.serializers),
    routes,
    trackRequests: config.environment === 'test',
  };

  return createServer(finalConfig);
}

function routes() {
  this.passthrough('/write-coverage'); // used by ember-cli-code-coverage
  this.passthrough('/assets/**'); // 3d models?
  this.passthrough('https://beacon-v2.helpscout.net/**'); // HelpScout Beacon
  this.passthrough('https://d3hb14vkzrxvla.cloudfront.net/**'); // HelpScout Beacon
  this.passthrough('https://unpkg.com/**'); // Shiki
  this.passthrough('/version.txt');

  this.urlPrefix = config.x.backendUrl;
  this.namespace = '/api/v1';
  // this.timing = 1000;

  this.pretender.prepareHeaders = function (headers) {
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';

    return headers;
  };

  window.server = this; // Hack! Is there a better way?

  affiliateEarningsPayouts(this);
  affiliateLinks(this);
  affiliateReferrals(this);
  analyticsEvents(this);
  autofixRequests(this);
  badges(this);
  charges(this);
  codeWalkthroughs(this);
  communityCourseStageSolutionComments(this);
  communityCourseStageSolutions(this);
  communitySolutionEvaluations(this);
  communitySolutionEvaluators(this);
  communitySolutionExports(this);
  communitySolutionsAnalyses(this);
  conceptEngagements(this);
  conceptGroups(this);
  conceptQuestions(this);
  concepts(this);
  contests(this);
  courseDefinitionUpdates(this);
  courseExtensionActivations(this);
  courseExtensionIdeas(this);
  courseIdeas(this);
  courseLanguageRequests(this);
  courseLeaderboardEntries(this);
  courseStageComments(this);
  courseStageCompletions(this);
  courseStageFeedbackSubmissions(this);
  courseStageLanguageGuides(this);
  courseTesterVersions(this);
  courses(this);
  downvotes(this);
  emailAddresses(this);
  fakeSubmissionLogs(this);
  featureSuggestions(this);
  freeUsageGrants(this);
  githubAppInstallations(this);
  githubRepositorySyncConfigurations(this);
  individualCheckoutSessions(this);
  individualPaymentMethodUpdateRequests(this);
  institutionMembershipGrantApplications(this);
  institutions(this);
  languages(this);
  leaderboardEntries(this);
  leaderboardRankCalculations(this);
  logstreams(this);
  onboardingSurveys(this);
  perks(this);
  promotionalDiscounts(this);
  referralActivations(this);
  referralLinks(this);
  regionalDiscounts(this);
  repositories(this);
  sessions(this);
  siteFeedbackSubmissions(this);
  slackIntegrations(this);
  solutionComparisons(this);
  submissions(this);
  subscriptions(this);
  teamMemberships(this);
  teamPaymentFlows(this);
  teamPaymentMethodUpdateRequests(this);
  teamSubscriptions(this);
  teams(this);
  trackLeaderboardEntries(this);
  trustedCommunitySolutionEvaluations(this);
  upvotes(this);
  users(this);
  views(this);
}
