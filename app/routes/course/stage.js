import BaseRoute from 'codecrafters-frontend/lib/base-route';
import { inject as service } from '@ember/service';

export default class CourseStageRoute extends BaseRoute {
  @service store;

  async model(params) {
    const courseRouteModel = this.modelFor('course');
    const courseStage = courseRouteModel.course.stages.find((courseStage) => courseStage.position === parseInt(params.stage_number));

    return {
      courseStage: courseStage,
      ...courseRouteModel,
      regionalDiscount: await this.store.createRecord('regional-discount').fetchCurrent(),
    };
  }
}
