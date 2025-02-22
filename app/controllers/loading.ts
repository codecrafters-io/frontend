import Controller from '@ember/controller';
import { action } from '@ember/object';
import { later, cancel } from '@ember/runloop';

export default class LoadingController extends Controller {
  cancellable: ReturnType<typeof later> | null = null;

  @action
  async handleDidInsertLoadingIndicator(element: HTMLDivElement) {
    this.cancellable = later(() => {
      if (element) {
        element.classList.add('opacity-100');
        element.classList.remove('opacity-0');
      }
    }, 1000);
  }

  @action
  async handleWillDestroyLoadingIndicator() {
    if (this.cancellable) {
      cancel(this.cancellable);
    }
  }
}
