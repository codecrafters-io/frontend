import Controller from '@ember/controller';
import type { ModelType as CourseRouteModelType } from 'codecrafters-frontend/routes/course';

export default class CourseCompletedController extends Controller {
  declare model: CourseRouteModelType;
}
