import BaseRoute from 'codecrafters-frontend/lib/base-route';

export default class CourseStageRoute extends BaseRoute {
  async model(params) {
    const courseRouteModel = this.modelFor('course');
    const courseStage = courseRouteModel.course.stages.find((courseStage) => courseStage.position === parseInt(params.stage_number));

    return {
      courseStage: courseStage,
      ...courseRouteModel,
    };
  }
}
