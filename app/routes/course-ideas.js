import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RSVP from 'rsvp';

export default class CourseIdeasRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service('current-user') currentUserService;
  @service store;

  model() {
    const modelPromises = {};

    modelPromises.courseIdeas = this.store.findAll('course-idea');

    // if (this.currentUserService.isAuthenticated) {
    //   // modelPromises.supervoteGrants = this.store.findAll('course-idea-supervote-grant');
    // }

    return RSVP.hash(modelPromises);
  }
}
