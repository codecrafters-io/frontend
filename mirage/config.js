import { discoverEmberDataModels, applyEmberDataSerializers } from 'ember-cli-mirage';
import { createServer } from 'miragejs';

export default function (config) {
  let finalConfig = {
    ...config,
    models: { ...discoverEmberDataModels(), ...config.models },
    serializers: applyEmberDataSerializers(config.serializers),
    routes,
  };

  return createServer(finalConfig);
}

function routes() {
  this.urlPrefix = '';
  this.namespace = '/api/v1';
  this.timing = 1000;

  window.server = this; // Hack! Is there a better way?

  this.post('/analytics-events');

  this.get('/charges');

  this.get('/code-walkthroughs');
  this.get('/courses');

  this.get('/course-language-requests');
  this.post('/course-language-requests');
  this.delete('/course-language-requests/:id');

  this.get('/course-ideas');

  this.post('/course-ideas/:id/unvote', () => {
    return {};
  });

  this.post('/course-idea-votes');
  this.post('/course-idea-supervotes');

  this.post('/course-stage-feedback-submissions');
  this.patch('/course-stage-feedback-submissions/:id');

  this.patch('/feature-suggestions/:id');

  this.post('/individual-checkout-sessions', function (schema) {
    return schema.individualCheckoutSessions.create({ url: 'https://test.com/checkout_session' });
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
    return schema.invoices.create({ total: 790000, lineItems: [{ amount: 790000, amount_after_discounts: 790000, quantity: 10 }] });
  });

  this.post('/team-subscriptions');

  this.delete('/team-memberships/:id');

  this.post('/team-payment-method-update-requests', function (schema) {
    return schema.teamPaymentMethodUpdateRequests.create({ url: 'https://test.com/team_payment_method_update_request' });
  });

  this.post('/team-payment-flows');
  this.patch('/team-payment-flows/:id');

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

  this.get('/users/:id');

  this.passthrough('https://d3hb14vkzrxvla.cloudfront.net/**'); // HelpScout Beacon
  this.passthrough('https://unpkg.com/**'); // Shiki
}
