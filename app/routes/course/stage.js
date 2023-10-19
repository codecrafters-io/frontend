import BaseRoute from 'codecrafters-frontend/lib/base-route';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';
import { inject as service } from '@ember/service';

export default class CourseStageRoute extends BaseRoute {
  @service router;
  @service coursePageState;

  constructor() {
    super(...arguments);

    this.router.on('routeDidChange', () => {
      const element = document.querySelector('[data-test-course-page-scrollable-area]');
      scrollToTop(element);
    });
  }

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
