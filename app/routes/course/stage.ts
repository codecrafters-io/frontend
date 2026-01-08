import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type { ModelType as CourseRouteModelType } from 'codecrafters-frontend/routes/course';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

export type ModelType = CourseRouteModelType & {
  courseStage: CourseStageModel | undefined;
};

export default class CourseStageRoute extends BaseRoute {
  @service declare router: RouterService;
  @service declare coursePageState: CoursePageStateService;

  constructor(...args: unknown[]) {
    // @ts-expect-error super constructor not typed with spread args
    super(...args);

    this.router.on('routeDidChange', () => {
      const element = document.querySelector('#course-page-scrollable-area');

      if (element) {
        // @ts-expect-error scrollToTop accepts Window but Element also works
        scrollToTop(element);
      } else {
        scrollToTop();
      }
    });
  }

  afterModel(model: ModelType) {
    if (!model.courseStage) {
      // @ts-expect-error activeStep.routeParams not fully typed
      this.router.transitionTo(this.coursePageState.activeStep.routeParams.route, ...this.coursePageState.activeStep.routeParams.models);
    }
  }

  async model(params: { stage_slug: string }): Promise<ModelType> {
    const courseRouteModel = this.modelFor('course') as CourseRouteModelType;

    const courseStage = courseRouteModel.course.stages.find((courseStage) => courseStage.slug === params.stage_slug);

    return {
      courseStage: courseStage,
      ...courseRouteModel,
    };
  }
}
