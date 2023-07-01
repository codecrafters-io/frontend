import Controller from '@ember/controller';
import { action } from '@ember/object';
import { later } from '@ember/runloop';

export default class LoadingController extends Controller {
  @action
  async handleDidInsertLoadingIndicator(element) {
    later(() => {
      if (element) {
        element.classList.add('opacity-100');
        element.classList.remove('opacity-0');
      }
    }, 1000);
  }
}
