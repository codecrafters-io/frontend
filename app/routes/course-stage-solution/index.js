import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class CourseStageSolutionIndexRoute extends ApplicationRoute {
  @service router;

  afterModel(model) {
    if (model.hasExplanation) {
      this.router.transitionTo('course-stage-solution.explanation');
    } else {
      this.router.transitionTo('course-stage-solution.diff');
    }
  }
}
