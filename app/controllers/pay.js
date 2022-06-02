import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class PayController extends Controller {
  @service currentUser;

  get testimonials() {
    return this.model.courses.findBy('slug', 'docker').testimonials;
  }
}
