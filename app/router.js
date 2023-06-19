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
  this.route('courses');
  this.route('course', { path: '/courses/:course_slug' });

  this.route('course.admin', { path: '/courses/:course_slug/admin' }, function () {
    this.route('submissions');
  });

  this.route('course-overview', { path: '/courses/:course_slug/overview' });
  this.route('join');
  this.route('membership');
  this.route('pay');
  this.route('refer');
  this.route('track', { path: '/tracks/:track_slug' });
  this.route('tracks');
  this.route('team', { path: '/teams/:team_id' });
  this.route('teams.create', { path: '/teams/create' });
  this.route('teams.pay', { path: '/teams/pay' });
  this.route('user', { path: '/users/:username' });

  this.route('vote', function () {
    this.route('course-ideas', { path: '/challenge-ideas' });
    this.route('course-extension-ideas', { path: '/challenge-extension-ideas' });
  });

  this.route('not-found', { path: '/*path' }); // Catch-all
  this.route('not-found', { path: '/404' }); // Allow redirecting to this route
});
