import Controller from '@ember/controller';
import CourseDefinitionUpdateModel from 'codecrafters-frontend/models/course-definition-update';

export default class CourseAdminUpdateController extends Controller {
  declare model: { update: CourseDefinitionUpdateModel; course: unknown };
}
