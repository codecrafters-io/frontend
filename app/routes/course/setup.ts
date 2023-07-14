// @ts-ignore
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import { inject as service } from '@ember/service';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';

export default class CourseSetupRoute extends BaseRoute {
  @service declare coursePageState: CoursePageStateService;
}
