import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { inject as service } from '@ember/service';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type { ModelType as CourseRouteModelType } from 'codecrafters-frontend/routes/course';

export type ModelType = CourseRouteModelType;

export default class CourseSetupRoute extends BaseRoute {
  @service declare coursePageState: CoursePageStateService;
}
