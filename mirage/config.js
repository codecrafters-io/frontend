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

  affiliateEarningsPayouts(this);
  affiliateLinks(this);
  affiliateReferrals(this);
  analyticsEvents(this);
  autofixRequests(this);
  badges(this);
  communityCourseStageSolutionComments(this);
  communityCourseStageSolutions(this);
  conceptEngagements(this);
  conceptGroups(this);
  conceptQuestions(this);
  concepts(this);
  contests(this);
  courseLeaderboardEntries(this);
  courseStageComments(this);
  courseStageCompletions(this);
  courseStageFeedbackSubmissions(this);
  courses(this);
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
  upvotes(this);
  users(this);
  views(this);

  // TODO: Move everything else to separate 'handler' files too

  // mirage/handlers/community-solution-evaluators.js
  this.get('/community-solution-evaluators');

  // mirage/handlers/community-solution-evaluations.js
  this.get('/community-solution-evaluations');

  // mirage/handlers/charges.js
  this.get('/charges');

  // mirage/handlers/code-walkthroughs.js
  this.get('/code-walkthroughs');

  // mirage/handlers/course-definition-updates.js
  this.get('/course-definition-updates');
  this.get('/course-definition-updates/:id');

  this.post('/course-definition-updates/:id/apply', function (schema, request) {
    const courseDefinitionUpdate = schema.courseDefinitionUpdates.find(request.params.id);

    if (courseDefinitionUpdate.summary.includes('[should_error]')) {
      courseDefinitionUpdate.update({ lastErrorMessage: 'Expected "slug" to be "redis", got: "docker".\n\nChange slug to "redis" to fix this.' });
    } else {
      courseDefinitionUpdate.update({ appliedAt: new Date(), status: 'applied', lastErrorMessage: null });
    }

    return courseDefinitionUpdate;
  });

  // mirage/handlers/course-extension-activations.js
  this.post('/course-extension-activations');
  this.delete('/course-extension-activations/:id');

  // mirage/handlers/course-extension-ideas.js
  this.get('/course-extension-ideas');
  this.post('/course-extension-ideas/:id/unvote', () => {});
  this.post('/course-extension-idea-votes');

  // mirage/handlers/course-ideas.js
  this.get('/course-ideas');
  this.post('/course-ideas/:id/unvote', () => {});
  this.post('/course-idea-votes');

  // mirage/handlers/course-language-requests.js
  this.get('/course-language-requests');
  this.post('/course-language-requests');
  this.delete('/course-language-requests/:id');

  // mirage/handlers/course-stage-language-guides.js
  this.get('/course-stage-language-guides');

  // mirage/handlers/course-tester-versions.js
  this.get('/course-tester-versions');
  this.get('/course-tester-versions/:id');

  this.post('/course-tester-versions/:id/activate', function (schema, request) {
    const courseTesterVersion = schema.courseTesterVersions.find(request.params.id);
    courseTesterVersion.update({ isActive: true });

    const otherTesterVersions = schema.courseTesterVersions.where((version) => version.id !== courseTesterVersion.id);
    otherTesterVersions.update({ isActive: false });

    return courseTesterVersion;
  });

  this.post('/course-tester-versions/:id/deprovision', function (schema, request) {
    return schema.courseTesterVersions.find(request.params.id);
  });

  // mirage/handlers/feature-suggestions.js
  this.patch('/feature-suggestions/:id');

  // mirage/handlers/free-usage-grants.js
  this.get('/free-usage-grants', function (schema, request) {
    return schema.freeUsageGrants.where({ userId: request.queryParams.user_id });
  });

  // mirage/handlers/solution-comparisons.js
  this.get('/solution-comparisons');
}
