import BaseRoute from 'codecrafters-frontend/lib/base-route';
import { inject as service } from '@ember/service';

export default class CourseStageRoute extends BaseRoute {
  @service router;
  @service coursePageState;

  afterModel(model) {
    if (!model.courseStage) {
      this.router.transitionTo(this.coursePageState.activeStep.routeParams.route, ...this.coursePageState.activeStep.routeParams.models);
    }
  }

  async model(params) {
    const courseRouteModel = this.modelFor('course');

    const courseStage = courseRouteModel.course.stages.find((courseStage) => courseStage.identifierForURL === params.stage_identifier);

    return {
      courseStage: courseStage,
      ...courseRouteModel,
    };
  }
}
