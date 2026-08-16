import Controller from '@ember/controller';
import CourseController from 'codecrafters-frontend/controllers/course';
import { action } from '@ember/object';
import { getOwner } from '@ember/owner';
import { service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type { ModelType as CourseRouteModelType } from 'codecrafters-frontend/routes/course';
import type StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';

export default class IntroductionController extends Controller {
  declare model: CourseRouteModelType;

  @service declare authenticator: AuthenticatorService;
  @service declare coursePageState: CoursePageStateService;

  get currentStep(): StepDefinition {
    return this.coursePageState.currentStep as StepDefinition;
  }

  @action
  handleLanguageSelected(repository: RepositoryModel) {
    const courseController = getOwner(this)!.lookup('controller:course') as CourseController;
    courseController.shouldSkipNextModelRefresh = true;
    courseController.repo = repository.id;
    courseController.track = undefined;
  }
}
