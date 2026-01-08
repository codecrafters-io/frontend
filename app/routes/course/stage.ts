import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import { service } from '@ember/service';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type RouterService from '@ember/routing/router-service';
import type { ModelType as CourseRouteModelType } from 'codecrafters-frontend/routes/course';
import { action } from '@ember/object';

export default class CourseStageRoute extends BaseRoute {
  @service declare router: RouterService;
  @service declare coursePageState: CoursePageStateService;

  activate() {
    this.router.on('routeDidChange', this.handleRouteDidChange);
  }

  afterModel(model: { courseStage: unknown }) {
    if (!model.courseStage) {
      // @ts-expect-error router transitionTo
      this.router.transitionTo(this.coursePageState.activeStep.routeParams.route, ...this.coursePageState.activeStep.routeParams.models);
    }
  }

  deactivate() {
    this.router.off('routeDidChange', this.handleRouteDidChange);
  }

  @action
  handleRouteDidChange() {
    const element = document.querySelector('#course-page-scrollable-area');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scrollToTop(element as any);
  }

  async model(params: { stage_slug: string }) {
    const courseRouteModel = this.modelFor('course') as CourseRouteModelType;

    const courseStage = courseRouteModel.course.stages.find((courseStage) => courseStage.slug === params.stage_slug);

    return {
      courseStage: courseStage,
      ...courseRouteModel,
    };
  }
}
