import Controller from '@ember/controller';

export default class AdminCourseSubmissionsController extends Controller {
  queryParams = ['usernames'];
  usernames = '';
}
