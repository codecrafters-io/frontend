import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type { ModelType } from 'codecrafters-frontend/routes/course/setup';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type { StepDefinition } from 'codecrafters-frontend/utils/course-page-step-list';

export default class CourseSetupController extends Controller {
  declare model: ModelType;

  @service declare coursePageState: CoursePageStateService;

  get currentStep(): StepDefinition {
    return this.coursePageState.currentStep as StepDefinition;
  }
}
