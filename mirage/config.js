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

  this.get('/course-language-requests');
  this.post('/course-language-requests');
  this.delete('/course-language-requests/:id');

  this.post('/individual-billing-sessions', function (schema) {
    return schema.individualBillingSessions.create({ url: 'https://test.com/billing_session' });
  });

  this.post('/individual-checkout-sessions', function (schema) {
    return schema.individualCheckoutSessions.create({ url: 'https://test.com/checkout_session' });
  });

  this.get('/courses');

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

  this.get('/teams');
  this.delete('/team-memberships/:id');

  this.post('/team-billing-sessions', function (schema) {
    return schema.teamBillingSessions.create({ url: 'https://test.com/team_billing_session' });
  });

  this.get('/track-leaderboard-entries', function (schema, request) {
    let result = schema.trackLeaderboardEntries.all();

    if (request.queryParams.language_id) {
      result = result.filter((trackLeaderboardEntry) => trackLeaderboardEntry.language.id === request.queryParams.language_id);
    }

    return result;
  });

  this.passthrough('https://d3hb14vkzrxvla.cloudfront.net/**'); // HelpScout Beacon
}
