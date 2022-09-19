import EmberRouter from '@ember/routing/router';
import config from 'codecrafters-frontend/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('code-walkthrough', { path: '/walkthroughs/:code_walkthrough_slug' });
  this.route('courses');
  this.route('course', { path: '/courses/:course_slug' });

  this.route('course.admin', { path: '/courses/:course_slug/admin' }, function () {
    this.route('submissions');
  });

  this.route('course-ideas', { path: '/vote' });
  this.route('course-overview', { path: '/courses/:course_slug/overview' });
  this.route('membership');
  this.route('pay');
  this.route('track', { path: '/tracks/:track_slug' });
  this.route('tracks');
  this.route('team', { path: '/teams/:team_id' });
  this.route('teams.create', { path: '/teams/create' });
  this.route('user', { path: '/users/:username' });

  this.route('not-found', { path: '/*path' }); // Catch-all
  this.route('not-found', { path: '/404' }); // Allow redirecting to this route
});
