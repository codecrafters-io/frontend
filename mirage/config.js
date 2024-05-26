import { applyEmberDataSerializers, discoverEmberDataModels } from 'ember-cli-mirage';
import { createServer, belongsTo, hasMany, Model } from 'miragejs';
import config from 'codecrafters-frontend/config/environment';

import affiliateEarningsPayouts from './handlers/affiliate-earnings-payouts';
import affiliateLinks from './handlers/affiliate-links';
import affiliateReferrals from './handlers/affiliate-referrals';
import analyticsEvents from './handlers/analytics-events';
import autofixRequests from './handlers/autofix-requests';
import badges from './handlers/badges';
import communityCourseStageSolutionComments from './handlers/community-course-stage-solution-comments';
import communityCourseStageSolutions from './handlers/community-course-stage-solutions';
import conceptEngagements from './handlers/concept-engagements';
import conceptGroups from './handlers/concept-groups';
import concepts from './handlers/concepts';
import conceptQuestions from './handlers/concept-questions';
import contests from './handlers/contests';
import courseLeaderboardEntries from './handlers/course-leaderboard-entries';
import courseStageComments from './handlers/course-stage-comments';
import courseStageCompletions from './handlers/course-stage-completions';
import courseStageFeedbackSubmissions from './handlers/course-stage-feedback-submissions';
import courses from './handlers/courses';
import downvotes from './handlers/downvotes';
import fakeSubmissionLogs from './handlers/fake-submission-logs';
import githubAppInstallations from './handlers/github-app-installations';
import githubRepositorySyncConfigurations from './handlers/github-repository-sync-configurations';
import individualCheckoutSessions from './handlers/individual-checkout-sessions';
import individualPaymentMethodUpdateRequests from './handlers/individual-payment-method-update-requests';
import languages from './handlers/languages';
import leaderboardEntries from './handlers/leaderboard-entries';
import logstreams from './handlers/logstreams';
import onboardingSurveys from './handlers/onboarding-surveys';
import perks from './handlers/perks';
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
          language: belongsTo('language', { inverse: null }),
          screencasts: hasMany('course-stage-screencast', { inverse: 'solution' }),
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

  users(this);
  courseLeaderboardEntries(this);
  affiliateEarningsPayouts(this);
  affiliateLinks(this);
  affiliateReferrals(this);
  analyticsEvents(this);
  autofixRequests(this);
  badges(this);
  communityCourseStageSolutions(this);
  communityCourseStageSolutionComments(this);
  conceptEngagements(this);
  conceptGroups(this);
  concepts(this);
  conceptQuestions(this);
  contests(this);
  courses(this);
  courseStageComments(this);
  courseStageCompletions(this);
  courseStageFeedbackSubmissions(this);
  downvotes(this);
  fakeSubmissionLogs(this);
  githubAppInstallations(this);
  githubRepositorySyncConfigurations(this);
  individualCheckoutSessions(this);
  individualPaymentMethodUpdateRequests(this);
  languages(this);
  leaderboardEntries(this);
  logstreams(this);
  onboardingSurveys(this);
  perks(this);
  referralActivations(this);
  referralLinks(this);
  regionalDiscounts(this);
  repositories(this);
  siteFeedbackSubmissions(this);
  slackIntegrations(this);
  solutionComparisons(this);
  submissions(this);
  subscriptions(this);
  teams(this);
  teamSubscriptions(this);
  teamMemberships(this);
  teamPaymentMethodUpdateRequests(this);
  teamPaymentFlows(this);
  trackLeaderboardEntries(this);
  upvotes(this);
  views(this);
  sessions(this);

  // TODO: Move these to handler files too
  // mirage/handlers/community-solution-evaluators.js
  this.get('/community-solution-evaluators');
  // mirage/handlers/community-solution-evaluations.js
  this.get('/community-solution-evaluations');
  // mirage/handlers/charges.js
  this.get('/charges');
  // mirage/handlers/code-walkthroughs.js
  this.get('/code-walkthroughs');
}
