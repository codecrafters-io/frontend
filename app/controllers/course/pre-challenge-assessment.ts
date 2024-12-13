import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type { ModelType as CourseRouteModelType } from 'codecrafters-frontend/routes/course';
import type Step from 'codecrafters-frontend/utils/course-page-step-list/step';

export default class PreChallengeAssessmentController extends Controller {
  declare model: CourseRouteModelType;

  @service declare authenticator: AuthenticatorService;
  @service declare coursePageState: CoursePageStateService;

  get currentStep(): Step {
    return this.coursePageState.currentStep as Step;
  }
}
