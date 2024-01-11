import EmberRouter from '@embroider/router';
import config from 'codecrafters-frontend/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('badges');
  this.route('catalog');
  this.route('code-walkthrough', { path: '/walkthroughs/:code_walkthrough_slug' });
  this.route('concepts');
  this.route('concept', { path: '/concepts/:concept_slug' });

  this.route('concept-admin', { path: '/concepts/:concept_slug/admin' }, function () {
    this.route('basic-details');
    this.route('blocks');
    this.route('question', { path: '/questions/:question_slug' });
    this.route('questions');
  });

  this.route('concept-group', { path: '/collections/:concept_group_slug' });
  this.route('contests');
  this.route('contest', { path: '/contests/:contest_slug' });
  this.route('courses');

  this.route('course', { path: '/courses/:course_slug' }, function () {
    this.route('introduction');
    this.route('setup');

    // Stage identifier either be '1' (for base stages) or 'ext2:1' (for extension stages)
    this.route('stage', { path: '/stages/:stage_identifier' }, function () {
      this.route('code-examples');
      this.route('concepts');
      this.route('instructions', { path: '/' });
      this.route('screencasts');
    });

    this.route('base-stages-completed');
    this.route('completed');
  });

  this.route('course-admin', { path: '/courses/:course_slug/admin' }, function () {
    this.route('buildpacks');
    this.route('buildpack', { path: '/buildpacks/:buildpack_id' });
    this.route('code-example', { path: '/code-examples/:code_example_id' });
    this.route('feedback');
    this.route('insights');
    this.route('submissions');
    this.route('tester-versions');
    this.route('update', { path: '/updates/:update_id' });
    this.route('updates');
  });

  this.route('course-overview', { path: '/courses/:course_slug/overview' });
  this.route('join');
  this.route('login');
  this.route('logged-in');
  this.route('membership');
  this.route('pay');

  this.route('perk', { path: '/perks/:slug' }, function () {
    this.route('claim');
  });

  this.route('partner');
  this.route('refer');
  this.route('referral-link', { path: '/r/:referral_link_slug' });
  this.route('team', { path: '/teams/:team_id' });
  this.route('teams.create', { path: '/teams/create' });
  this.route('teams.pay', { path: '/teams/pay' });
  this.route('track', { path: '/tracks/:track_slug' });
  this.route('tracks');
  this.route('user', { path: '/users/:username' });

  this.route('vote', function () {
    this.route('course-ideas', { path: '/challenge-ideas' });
    this.route('course-extension-ideas', { path: '/challenge-extension-ideas' });
  });

  this.route('welcome');

  this.route('not-found', { path: '/*path' }); // Catch-all
  this.route('not-found', { path: '/404' }); // Allow redirecting to this route
});
