import Service, { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import { StepList, Step } from 'codecrafters-frontend/lib/course-page-step-list';
import { tracked } from '@glimmer/tracking';

export default class CoursePageStateService extends Service {
  @service declare router: RouterService;
  @tracked stepList?: StepList;

  setStepList(stepList: StepList): void {
    this.stepList = stepList;
  }

  get activeStep(): Step {
    return this.stepList?.activeStep as Step;
  }

  get currentStep(): Step {
    if (!this.stepList) {
      // @ts-ignore
      return null;
    }

    if (this.router.currentRouteName === 'course.introduction') {
      return this.stepList.steps[0] as Step;
    } else if (this.router.currentRouteName === 'course.setup') {
      return this.stepList.steps[1] as Step;
    } else if (this.router.currentRouteName === 'course.completed') {
      return this.stepList.steps[this.stepList.steps.length - 1] as Step;
    } else if (this.router.currentRouteName.startsWith('course.stage')) {
      const courseStageRoute = this.router.currentRoute.find((route: any) => route.name === 'course.stage');

      // @ts-ignore
      const routeParams = courseStageRoute.params as { stage_identifier: string };
      const stageIdentifier = routeParams.stage_identifier;

      // @ts-ignore
      return this.stepList.steps.find(
        // @ts-ignore
        (step) => step.type === 'CourseStageStep' && step.courseStage.identifierForURL === stageIdentifier,
      );
    } else {
      // happens on course.index for example, when we're redirecting to /catalog
      return this.stepList.steps[0] as Step;
    }
  }

  get nextStep(): Step | null {
    if (!this.stepList) {
      // @ts-ignore
      return null;
    }

    return this.stepList.nextVisibleStepFor(this.currentStep);
  }
}
