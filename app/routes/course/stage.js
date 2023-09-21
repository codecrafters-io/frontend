import BaseRoute from 'codecrafters-frontend/lib/base-route';
import { inject as service } from '@ember/service';

export default class CourseStageRoute extends BaseRoute {
  @service router;

  async model(params) {
    const courseRouteModel = this.modelFor('course');

    let courseStage;

    if (params.stage_identifier.includes(':')) {
      const [extensionSlug, position] = params.stage_identifier.split(':');

      // Might be null
      courseStage = courseRouteModel.course.stages.find(
        (courseStage) => courseStage.positionWithinExtension === position && courseStage.primaryExtensionSlug === extensionSlug,
      );
    } else {
      let position = parseInt(params.stage_identifier); // Might be Nan
      courseStage = courseRouteModel.course.stages.find((courseStage) => courseStage.positionWithinCourse === position);
    }

    return {
      courseStage: courseStage,
      ...courseRouteModel,
    };
  }

  afterModel(model) {
    if (!model.courseStage) {
      this.router.transitionTo('catalog');
    }
  }
}
