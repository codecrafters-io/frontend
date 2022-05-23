import EmberRouter from '@ember/routing/router';
import config from 'codecrafters-frontend/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('admin', function () {
    this.route('courses');

    this.route('course', { path: '/courses/:course_slug' }, function () {
      this.route('submissions');
    });
  });

  this.route('courses');
  this.route('course', { path: '/courses/:course_slug' });
  this.route('course-overview', { path: '/courses/:course_slug/overview' });

  this.route('team', { path: '/teams/:team_id' });
});
