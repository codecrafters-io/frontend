import BaseRoute from 'codecrafters-frontend/lib/base-route';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';
import { inject as service } from '@ember/service';

export default class CourseStageRoute extends BaseRoute {
  @service router;
  @service coursePageState;

  constructor() {
    super(...arguments);

    this.router.on('routeWillChange', (transition) => {
      const currentStageId = transition?.to?.parent?.params?.stage_identifier;
      const previousStageId = transition?.from?.parent?.params?.stage_identifier;
      const element = document.querySelector('.course-page-scrollable-area');

      if (currentStageId === previousStageId) {
        scrollToTop(element, 'smooth');
      } else {
        scrollToTop(element);
      }
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
