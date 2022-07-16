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
  this.route('pay');
  this.route('track', { path: '/tracks/:track_slug' });
  this.route('tracks');
  this.route('team', { path: '/teams/:team_id' });
  this.route('teams.create', { path: '/teams/create' });
  this.route('code-walkthrough', { path: '/walkthroughs/:code_walkthrough_slug' });
});
