import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RSVP from 'rsvp';

export default class CourseIdeasRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service('current-user') currentUserService;
  @service store;

  model() {
    const modelPromises = {};

    modelPromises.courseIdeas = this.store.findAll('course-idea', { include: 'votes,votes.user,supervotes,supervotes.user' });

    if (this.currentUserService.isAuthenticated) {
      // No need to wait on this, can load in the background
      this.store.findRecord('user', this.currentUserService.record.id, {
        include: 'course-idea-supervote-grants',
        reload: true,
      });
    }

    return RSVP.hash(modelPromises);
  }
}
