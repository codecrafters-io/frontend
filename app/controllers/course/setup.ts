import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type { ModelType } from 'codecrafters-frontend/routes/course/setup';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';

export default class CourseSetupController extends Controller {
  declare model: ModelType;

  @service declare coursePageState: CoursePageStateService;
}
