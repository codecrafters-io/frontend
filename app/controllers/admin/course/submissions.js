import Controller from '@ember/controller';

export default class AdminCourseSubmissionsController extends Controller {
  queryParams = ['languages', 'usernames'];
  languages = '';
  usernames = '';
}
