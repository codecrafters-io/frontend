import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class CourseSetupController extends Controller {
  @service coursePageState;
}
