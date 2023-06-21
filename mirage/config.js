import { applyEmberDataSerializers, discoverEmberDataModels } from 'ember-cli-mirage';
import { createServer, belongsTo, hasMany, Model } from 'miragejs';
import config from 'codecrafters-frontend/config/environment';

export default function (config) {
  let finalConfig = {
    ...config,
    models: {
      ...discoverEmberDataModels(),
      ...config.models,
      ...{
        courseStageComment: Model.extend({
          user: belongsTo('user'),
          target: belongsTo('course-stage'),
          language: belongsTo('language'),
          currentUserDownvotes: hasMany('downvote', { inverse: 'downvotable' }),
          currentUserUpvotes: hasMany('upvote', { inverse: 'upvotable' }),
          parentComment: belongsTo('course-stage-comment', { inverse: null }),
        }),
        communityCourseStageSolutionComment: Model.extend({
          user: belongsTo('user'),
          target: belongsTo('community-course-stage-solution'),
          language: belongsTo('language'),
          currentUserDownvotes: hasMany('downvote', { inverse: 'downvotable' }),
          currentUserUpvotes: hasMany('upvote', { inverse: 'upvotable' }),
          parentComment: belongsTo('community-course-stage-solution-comment', { inverse: null }),
        }),
      },
    },
    serializers: applyEmberDataSerializers(config.serializers),
    routes,
  };

  return createServer(finalConfig);
}

function routes() {
  this.passthrough('/write-coverage'); // used by ember-cli-code-coverage
  this.passthrough('/assets/**'); // 3d models?

  this.urlPrefix = config.x.backendUrl;
  this.namespace = '/api/v1';
  this.timing = 1000;

  this.pretender.prepareHeaders = function (headers) {
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';

    return headers;
  };

  window.server = this; // Hack! Is there a better way?

  this.post('/analytics-events');

  this.get('/badges');
  this.get('/concepts');
  this.get('/charges');

  this.get('/code-walkthroughs');

  // TODO: Add pagination
  this.get('/community-course-stage-solutions', function (schema, request) {
    let result = schema.communityCourseStageSolutions.all();

    if (request.queryParams.language_id) {
      result = result.filter((solution) => solution.language.id.toString() === request.queryParams.language_id);
    }

    if (request.queryParams.course_stage_id) {
      result = result.filter((solution) => solution.courseStage.id.toString() === request.queryParams.course_stage_id);
    }

    return result;
  });

  this.get('/community-course-stage-solution-comments', function (schema, request) {
    let result = schema.communityCourseStageSolutionComments.all().filter((comment) => comment.targetId.toString() === request.queryParams.target_id);

    return result;
  });

  this.post('/community-course-stage-solution-comments', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.createdAt = new Date();

    return schema.communityCourseStageSolutionComments.create(attrs);
  });

  this.post('/community-course-stage-solution-comments/:id/unvote', () => {});

  this.get('/courses');

  this.get('/course-language-requests');
  this.post('/course-language-requests');
  this.delete('/course-language-requests/:id');

  this.get('/course-extension-ideas');
  this.post('/course-extension-ideas/:id/unvote', () => {});
  this.post('/course-extension-idea-votes');
  this.post('/course-extension-idea-supervotes');

  this.get('/course-ideas');
  this.post('/course-ideas/:id/unvote', () => {});
  this.post('/course-idea-votes');
  this.post('/course-idea-supervotes');

  this.get('/course-stage-comments', function (schema, request) {
    let result = schema.courseStageComments.all().filter((comment) => comment.targetId.toString() === request.queryParams.target_id);

    return result;
  });

  this.post('/course-stage-comments', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.createdAt = new Date();

    return schema.courseStageComments.create(attrs);
  });

  this.delete('/course-stage-comments/:id');
  this.patch('/course-stage-comments/:id');
  this.post('/course-stage-comments/:id/unvote', () => {});

  this.get('/custom-discounts');

  this.post('/downvotes');
  this.post('/upvotes');

  this.post('/course-stage-feedback-submissions');
  this.patch('/course-stage-feedback-submissions/:id');

  this.patch('/feature-suggestions/:id');

  this.get('/github-app-installations');
  this.get('/github-app-installations/:id');

  this.get('/github-app-installations/:id/accessible-repositories', function () {
    return [
      { id: 564057934, full_name: 'rohitpaulk/cc-publish-test', created_at: '2022-11-09T22:40:59Z' },
      { id: 564057935, full_name: 'rohitpaulk/other-repo', created_at: '2022-10-08T22:40:59Z' },
    ];
  });

  this.get('/github-repository-sync-configurations');
  this.post('/github-repository-sync-configurations');
  this.delete('/github-repository-sync-configurations/:id');

  this.post('/individual-checkout-sessions', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.url = 'https://test.com/checkout_session';

    return schema.individualCheckoutSessions.create(attrs);
  });

  this.post('/individual-payment-method-update-requests', function (schema) {
    return schema.individualPaymentMethodUpdateRequests.create({ url: 'https://test.com/checkout_session' });
  });

  this.get('/languages');

  this.get('/leaderboard-entries', function (schema, request) {
    let result = schema.leaderboardEntries.all();

    if (request.queryParams.team_id) {
      const team = schema.teams.find(request.queryParams.team_id);
      const teamMemberships = schema.teamMemberships.where({ teamId: team.id }).models;
      const userIds = teamMemberships.map((teamMembership) => teamMembership.user.id);

      result = result.filter((leaderboardEntry) => userIds.includes(leaderboardEntry.user.id));
    }

    if (request.queryParams.course_id) {
      result = result.filter((leaderboardEntry) => leaderboardEntry.currentCourseStage.course.id === request.queryParams.course_id);
    }

    return result;
  });

  this.post('/referral-activations', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.activatedAt = new Date();

    return schema.referralActivations.create(attrs);
  });

  this.get('/referral-earnings-payouts');
  this.post('/referral-earnings-payouts');

  this.get('/referral-links');

  this.post('/referral-links', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.url = `https://app.codecraters.io/refer?via=${attrs.slug}`;
    attrs.uniqueViewerCount = 0;

    return schema.referralLinks.create(attrs);
  });

  this.get('/repositories', function (schema, request) {
    let repositories;

    if (request.queryParams.course_id) {
      repositories = schema.repositories.where({ userId: '63c51e91-e448-4ea9-821b-a80415f266d3', courseId: request.queryParams.course_id });
    } else {
      repositories = schema.repositories.where({ userId: '63c51e91-e448-4ea9-821b-a80415f266d3' });
    }

    return repositories.filter((repository) => !!repository.lastSubmission); // API doesn't return repositories without submissions
  });

  this.post('/repositories', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    const language = schema.languages.find(attrs.languageId);

    attrs.cloneUrl = 'https://git.codecraters.io/a-long-test-string.git';
    attrs.name = `${language.name}`;

    return schema.repositories.create(attrs);
  });

  this.post('/site-feedback-submissions');

  this.delete('/slack-integrations/:id');

  this.get('/submissions', function (schema, request) {
    const queryParams = request.queryParams;

    return schema.submissions
      .all()
      .filter((submission) => submission.repository.course.id === queryParams.course_id)
      .filter((submission) => !queryParams.usernames || queryParams.usernames.includes(submission.repository.user.username))
      .filter((submission) => !queryParams.language_slugs || queryParams.language_slugs.includes(submission.repository.language.slug));
  });

  this.get('/subscriptions', function (schema) {
    return schema.subscriptions.where({ userId: '63c51e91-e448-4ea9-821b-a80415f266d3' });
  });

  this.post('/subscriptions/:id/cancel-trial', function (schema, request) {
    const subscription = schema.subscriptions.find(request.params.id);
    subscription.update({ endedAt: new Date() });

    return subscription;
  });

  this.post('/subscriptions/:id/cancel', function (schema, request) {
    const subscription = schema.subscriptions.find(request.params.id);
    subscription.update({ cancelAtPeriodEnd: true, cancelAt: subscription.currentPeriodEnd });

    return subscription;
  });

  this.get('/teams');

  this.post('/teams', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    const team = schema.teams.create({ name: attrs.name });
    schema.teamMemberships.create({ isAdmin: true, team: team, userId: '63c51e91-e448-4ea9-821b-a80415f266d3' });

    return team;
  });

  this.get('/teams/:id/first-invoice-preview', function (schema) {
    return schema.invoices.create({ amountDue: 790000, lineItems: [{ amount: 790000, amount_after_discounts: 790000, quantity: 10 }] });
  });

  this.post('/team-subscriptions');

  this.delete('/team-memberships/:id');

  this.post('/team-payment-method-update-requests', function (schema) {
    return schema.teamPaymentMethodUpdateRequests.create({ url: 'https://test.com/team_payment_method_update_request' });
  });

  this.post('/team-payment-flows');
  this.get('/team-payment-flows/:id');
  this.patch('/team-payment-flows/:id');

  this.get('/team-payment-flows/:id/first-invoice-preview', function (schema, request) {
    const teamPaymentFlow = schema.teamPaymentFlows.find(request.params.id);
    const amount = teamPaymentFlow.numberOfSeats * 79000;

    return schema.invoices.create({
      amountDue: amount,
      lineItems: [{ amount: amount, amount_after_discounts: amount, quantity: teamPaymentFlow.numberOfSeats }],
    });
  });

  this.post('/team-payment-flows/:id/attempt-payment', function () {
    return {
      error: 'Your card was declined.',
    };
  });

  this.get('/track-leaderboard-entries', function (schema, request) {
    let result = schema.trackLeaderboardEntries.all();

    if (request.queryParams.language_id) {
      result = result.filter((trackLeaderboardEntry) => trackLeaderboardEntry.language.id === request.queryParams.language_id);
    }

    return result;
  });

  this.get('/users', function (schema, request) {
    return schema.users.where({ username: request.queryParams.username });
  });

  this.get('/users/current', function (schema, request) {
    const session = schema.sessions.find('current-session-id');

    if (session) {
      return session.user;
    } else {
      return new Response(200, {}, { data: {} });
    }
  });

  this.get('/users/:id');

  this.get('/users/:id/next-invoice-preview', function (schema) {
    return schema.invoices.create({
      createdAt: new Date(2025, 1, 1),
      amountDue: 7900,
      lineItems: [{ amount: 7900, amount_after_discounts: 7900, quantity: 1 }],
    });
  });

  this.passthrough('https://d3hb14vkzrxvla.cloudfront.net/**'); // HelpScout Beacon
  this.passthrough('https://unpkg.com/**'); // Shiki
}
