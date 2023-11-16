import { applyEmberDataSerializers, discoverEmberDataModels } from 'ember-cli-mirage';
import { createServer, belongsTo, hasMany, Model, Response } from 'miragejs';
import config from 'codecrafters-frontend/config/environment';
import syncRepositoryStageLists from './utils/sync-repository-stage-lists';

export default function (config) {
  let finalConfig = {
    ...config,
    models: {
      ...discoverEmberDataModels(config.store),
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
    trackRequests: config.environment === 'test',
  };

  return createServer(finalConfig);
}

function routes() {
  this.passthrough('/write-coverage'); // used by ember-cli-code-coverage
  this.passthrough('/assets/**'); // 3d models?
  this.passthrough('https://d3hb14vkzrxvla.cloudfront.net/**'); // HelpScout Beacon
  this.passthrough('https://unpkg.com/**'); // Shiki

  this.urlPrefix = config.x.backendUrl;
  this.namespace = '/api/v1';
  this.timing = 1000;

  this.pretender.prepareHeaders = function (headers) {
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';

    return headers;
  };

  window.server = this; // Hack! Is there a better way?

  this.get('/affiliate-links');

  this.post('/affiliate-links', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.url = `https://app.codecraters.io/join?via=${attrs.slug}`;
    attrs.uniqueViewerCount = 0;

    return schema.affiliateLinks.create(attrs);
  });

  this.post('/affiliate-referrals', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    attrs.activatedAt = new Date();

    return schema.affiliateReferrals.create(attrs);
  });

  this.post('/analytics-events');

  this.get('/badges');

  this.get('/concept-groups', function (schema) {
    return schema.conceptGroups.all();
  });

  this.get('/concept-groups/:concept_group_slug', function (schema, request) {
    let result = schema.conceptGroups.where({ slug: request.params.concept_group_slug });

    return result.models[0];
  });

  this.get('/concepts');

  this.post('/concepts', function (schema) {
    return schema.concepts.create({ title: 'New Concept', slug: 'new-concept' });
  });

  this.patch('/concepts/:id', function (schema, request) {
    const concept = schema.concepts.find(request.params.id);
    const attrs = this.normalizedRequestAttrs();

    if (typeof attrs.title === 'string' && attrs.title.trim() === '') {
      return new Response(
        422,
        {},
        {
          errors: [
            {
              status: '422',
              detail: 'Title cannot be empty',
              source: { pointer: '/data/attributes/title' },
            },
          ],
        },
      );
    }

    if (typeof attrs.slug === 'string' && attrs.slug.trim() === '') {
      return new Response(
        422,
        {},
        {
          errors: [
            {
              status: '422',
              detail: 'Slug cannot be empty',
              source: { pointer: '/data/attributes/slug' },
            },
          ],
        },
      );
    }

    concept.update(attrs);

    return concept;
  });

  this.post('/concepts/:id/update-blocks', function (schema, request) {
    const concept = schema.concepts.find(request.params.id);
    const jsonBody = JSON.parse(request.requestBody);

    const oldBlocksFromRequest = jsonBody['old-blocks'];
    const oldBlocksFromConcept = concept.blocks;

    const serializedOldBlocksFromRequest = JSON.stringify(oldBlocksFromRequest);
    const serializedOldBlocksFromConcept = JSON.stringify(oldBlocksFromConcept);

    if (serializedOldBlocksFromRequest !== serializedOldBlocksFromConcept) {
      return new Response(
        400,
        {},
        {
          errors: [
            {
              detail: `Old blocks from request do not match old blocks from concept. Provided: ${serializedOldBlocksFromRequest}. Expected: ${serializedOldBlocksFromConcept}`,
            },
          ],
        },
      );
    }

    concept.update({ blocks: jsonBody['new-blocks'] });

    return concept;
  });

  this.post('/concept-questions', function (schema) {
    const attrs = this.normalizedRequestAttrs();

    return schema.conceptQuestions.create({
      conceptId: attrs.conceptId,
      slug: 'new',
      queryMarkdown: 'New Question?',
      options: [
        { markdown: 'Option 1', is_correct: true, explanation_markdown: 'Explanation 1' },
        { markdown: 'Option 2', is_correct: false, explanation_markdown: 'Explanation 2' },
      ],
    });
  });

  this.patch('/concept-questions/:id');

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

  this.post('/courses/:id/sync-course-definition-updates', function (schema, request) {
    const course_id = request.params.id;

    return schema.courseDefinitionUpdates.where({ course_id });
  });

  this.post('/courses/:id/sync-course-tester-versions', function (schema, request) {
    const course_id = request.params.id;

    return schema.courseTesterVersions.where({ course_id });
  });

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

  this.post('/course-extension-activations');
  this.delete('/course-extension-activations/:id');

  this.get('/course-language-requests');
  this.post('/course-language-requests');
  this.delete('/course-language-requests/:id');

  this.get('/course-extension-ideas');
  this.post('/course-extension-ideas/:id/unvote', () => {});
  this.post('/course-extension-idea-votes');

  this.get('/course-ideas');
  this.post('/course-ideas/:id/unvote', () => {});
  this.post('/course-idea-votes');

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

  this.get('/course-stage-language-guides');

  this.get('/course-tester-versions');

  this.post('/course-tester-versions/:id/activate', function (schema, request) {
    const courseTesterVersion = schema.courseTesterVersions.find(request.params.id);
    courseTesterVersion.update({ isActive: true });

    const otherTesterVersions = schema.courseTesterVersions.where((version) => version.id !== courseTesterVersion.id);
    otherTesterVersions.update({ isActive: false });

    return courseTesterVersion;
  });

  this.post('/course-stage-feedback-submissions');
  this.patch('/course-stage-feedback-submissions/:id');

  this.post('/downvotes');

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

  this.get('/perks', function (schema, request) {
    const slug = request.queryParams.slug;

    return schema.perks.where({ slug });
  });

  this.post('/perks/:id/claim', function () {
    return {
      claim_url: 'https://dummy-claim-url.com',
    };
  });

  this.get('/referral-earnings-payouts');
  this.post('/referral-earnings-payouts');

  this.get('/regional-discounts/current', function (schema) {
    const regionalDiscount = schema.regionalDiscounts.find('current-discount-id');

    if (regionalDiscount) {
      return regionalDiscount;
    } else {
      return new Response(200, {}, { data: null });
    }
  });

  this.get('/repositories', function (schema, request) {
    let repositories;

    if (request.queryParams.course_id) {
      repositories = schema.repositories.where({ userId: '63c51e91-e448-4ea9-821b-a80415f266d3', courseId: request.queryParams.course_id });
    } else {
      repositories = schema.repositories.where({ userId: '63c51e91-e448-4ea9-821b-a80415f266d3' });
    }

    syncRepositoryStageLists(window.server);

    return repositories;
  });

  this.post('/repositories', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    const language = schema.languages.find(attrs.languageId);

    attrs.cloneUrl = 'https://git.codecraters.io/a-long-test-string.git';
    attrs.name = `${language.name}`;

    return schema.repositories.create(attrs);
  });

  this.patch('/repositories/:id');

  this.delete('/repositories/:id');

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
    subscription.update({ cancelAt: subscription.currentPeriodEnd });

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

  this.post('/upvotes');

  this.get('/users', function (schema, request) {
    return schema.users.where({ username: request.queryParams.username });
  });

  this.get('/users/current', function (schema) {
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

  this.post('/views');
}
