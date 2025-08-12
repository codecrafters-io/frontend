import { applyEmberDataSerializers, discoverEmberDataModels } from 'ember-cli-mirage';
import { Model, belongsTo, createServer, hasMany } from 'miragejs';
import config from 'codecrafters-frontend/config/environment';
import affiliateEarningsPayouts from './handlers/affiliate-earnings-payouts';
import affiliateLinks from './handlers/affiliate-links';
import affiliateReferrals from './handlers/affiliate-referrals';
import analyticsEvents from './handlers/analytics-events';
import autofixRequests from './handlers/autofix-requests';
import badges from './handlers/badges';
import communityCourseStageSolutionComments from './handlers/community-course-stage-solution-comments';
import communityCourseStageSolutions from './handlers/community-course-stage-solutions';
import communitySolutionEvaluations from './handlers/community-solution-evaluations';
import conceptEngagements from './handlers/concept-engagements';
import conceptGroups from './handlers/concept-groups';
import conceptQuestions from './handlers/concept-questions';
import concepts from './handlers/concepts';
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
import fakeSubmissionLogs from './handlers/fake-submission-logs';
import githubAppInstallations from './handlers/github-app-installations';
import githubRepositorySyncConfigurations from './handlers/github-repository-sync-configurations';
import individualCheckoutSessions from './handlers/individual-checkout-sessions';
import individualPaymentMethodUpdateRequests from './handlers/individual-payment-method-update-requests';
import institutions from './handlers/institutions';
import institutionMembershipGrantApplications from './handlers/institution-membership-grant-applications';
import languages from './handlers/languages';
import leaderboardEntries from './handlers/leaderboard-entries';
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
import communitySolutionsAnalyses from './handlers/community-solutions-analyses';
import upvotes from './handlers/upvotes';
import users from './handlers/users';
import views from './handlers/views';

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
  communityCourseStageSolutionComments(this);
  communityCourseStageSolutions(this);
  communitySolutionEvaluations(this);
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
  fakeSubmissionLogs(this);
  githubAppInstallations(this);
  githubRepositorySyncConfigurations(this);
  individualCheckoutSessions(this);
  individualPaymentMethodUpdateRequests(this);
  institutions(this);
  institutionMembershipGrantApplications(this);
  languages(this);
  leaderboardEntries(this);
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
  communitySolutionsAnalyses(this);
  upvotes(this);
  users(this);
  views(this);

  // TODO: Move everything else to separate 'handler' files too

  // mirage/handlers/community-solution-evaluators.js
  this.get('/community-solution-evaluators');

  // mirage/handlers/charges.js
  this.get('/charges');

  // mirage/handlers/code-walkthroughs.js
  this.get('/code-walkthroughs');

  // mirage/handlers/feature-suggestions.js
  this.patch('/feature-suggestions/:id');

  // mirage/handlers/free-usage-grants.js
  this.get('/free-usage-grants', function (schema, request) {
    return schema.freeUsageGrants.where({ userId: request.queryParams.user_id });
  });

  // mirage/handlers/solution-comparisons.js
  this.get('/solution-comparisons');
}
