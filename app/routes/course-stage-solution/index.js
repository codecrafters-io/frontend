import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class CourseStageSolutionIndexRoute extends ApplicationRoute {
  @service router;

  beforeModel() {
    this.router.transitionTo('course-stage-solution.diff', this.paramsFor('course-stage-solution'));
  }
}
