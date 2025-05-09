import EmberRouter from '@embroider/router';
import config from 'codecrafters-frontend/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('account-deleted'); // TODO: Add dark mode support
  this.route('badges');
  this.route('catalog');
  this.route('code-walkthrough', { path: '/walkthroughs/:code_walkthrough_slug' }); // TODO: Add dark mode support
  this.route('concepts'); // TODO: Add dark mode support
  this.route('concept', { path: '/concepts/:concept_slug' }); // TODO: Add dark mode support

  this.route('concept-admin', { path: '/concepts/:concept_slug/admin' }, function () {
    this.route('basic-details');
    this.route('blocks');
    this.route('question', { path: '/questions/:question_slug' });
    this.route('questions');
  });

  this.route('concept-group', { path: '/collections/:concept_group_slug' }); // TODO: Add dark mode support
  this.route('contests');
  this.route('contest', { path: '/contests/:contest_slug' });
  this.route('courses');

  this.route('course-admin', { path: '/courses/:course_slug/admin' }, function () {
    this.route('buildpack', { path: '/buildpacks/:buildpack_id' });
    this.route('buildpacks');
    this.route('code-example', { path: '/code-examples/:code_example_id' });
    this.route('code-example-evaluator', { path: '/code-example-evaluators/:evaluator_slug' });
    this.route('code-example-evaluators');
    this.route('code-example-insights', { path: '/code-examples/stage/:stage_slug' });
    this.route('code-example-insights-index', { path: '/code-examples' });
    this.route('feedback');
    this.route('insights');
    this.route('stage-insights', { path: '/stage-insights/:stage_slug' });
    this.route('stage-insights-index', { path: '/stage-insights' });
    this.route('submissions');
    this.route('tester-version', { path: '/tester-versions/:tester_version_id' });
    this.route('tester-versions');
    this.route('update', { path: '/updates/:update_id' });
    this.route('updates');
  });

  // TODO: Add dark mode support
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

    this.route('extension-completed', { path: '/extension-completed/:extension_slug' });
    this.route('base-stages-completed');
    this.route('completed');
  });

  this.route('course-overview', { path: '/courses/:course_slug/overview' }); // TODO: Add dark mode support
  this.route('debug');
  this.route('join'); // TODO: Add dark mode support
  this.route('join-course', { path: '/join/:course_slug' });
  this.route('join-track', { path: '/join-track/:track_slug' });
  this.route('login'); // TODO: Add dark mode support?
  this.route('logged-in'); // TODO: Add dark mode support?
  this.route('membership'); // TODO: Add dark mode support
  this.route('pay'); // TODO: Add dark mode support

  this.route('perk', { path: '/perks/:slug' }, function () {
    this.route('claim');
  });

  this.route('partner');
  this.route('refer'); // TODO: Add dark mode support
  this.route('referral-link', { path: '/r/:referral_link_slug' }); // TODO: Add dark mode support

  this.route('settings', function () {
    this.route('profile');
    this.route('billing');
    this.route('account');
  });

  this.route('team', { path: '/teams/:team_id' }); // TODO: Add dark mode support
  this.route('teams.create', { path: '/teams/create' }); // TODO: Add dark mode support
  this.route('teams.pay', { path: '/teams/pay' });
  this.route('track', { path: '/tracks/:track_slug' }); // TODO: Add dark mode support
  this.route('tracks');
  this.route('update-required'); // TODO: Add dark mode support
  this.route('user', { path: '/users/:username' }); // TODO: Add dark mode support

  // TODO: Add dark mode support
  this.route('vote', function () {
    this.route('course-ideas', { path: '/challenges' });
    this.route('course-extension-ideas', { path: '/challenge-extensions' });
  });

  this.route('welcome');

  this.route('not-found', { path: '/*path' }); // Catch-all (TODO: Add dark mode support)
  this.route('not-found', { path: '/404' }); // Allow redirecting to this route

  this.route('demo', function () {
    this.route('code-mirror');
    this.route('dark-mode-toggle');
    this.route('file-contents-card');
    this.route('file-diff-card');
  });
});
