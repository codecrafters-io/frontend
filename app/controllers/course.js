import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class CourseController extends Controller {
  // TODO: Use query params
  get activeRepository() {
    return this.model.repositories.firstObject;
  }
}
