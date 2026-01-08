import Controller from '@ember/controller';
import { service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type { ModelType as CourseRouteModelType } from 'codecrafters-frontend/routes/course';
import type StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';

export default class IntroductionController extends Controller {
  declare model: CourseRouteModelType;

  @service declare authenticator: AuthenticatorService;
  @service declare coursePageState: CoursePageStateService;

  get currentStep(): StepDefinition {
    return this.coursePageState.currentStep as StepDefinition;
  }
}
