import Controller from '@ember/controller';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { cancel } from '@ember/runloop';

export default class LoadingController extends Controller {
  cancellable;

  @action
  async handleDidInsertLoadingIndicator(element) {
    this.cancellable = later(() => {
      if (element) {
        element.classList.add('opacity-100');
        element.classList.remove('opacity-0');
      }
    }, 1000);
  }

  @action
  async handleWillDestroyLoadingIndicator() {
    cancel(this.cancellable);
  }
}
