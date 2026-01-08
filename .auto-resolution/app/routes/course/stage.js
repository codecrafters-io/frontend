import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import { service } from '@ember/service';

export default class CourseStageRoute extends BaseRoute {
  @service router;
  @service coursePageState;

  constructor() {
    super(...arguments);

    this.router.on('routeDidChange', () => {
      const element = document.querySelector('#course-page-scrollable-area');
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

    const courseStage = courseRouteModel.course.stages.find((courseStage) => courseStage.slug === params.stage_slug);

    return {
      courseStage: courseStage,
      ...courseRouteModel,
    };
  }
}
