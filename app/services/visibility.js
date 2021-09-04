import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class VisibilityService extends Service {
  @service serverVariables;
  @service store;
  @tracked isVisible;

  constructor() {
    super();

    this.isVisible = true;
    this.setupVisibilityChangeEventHandlers();
  }

  get isHidden() {
    return !this.isVisible;
  }

  setupVisibilityChangeEventHandlers() {
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
    });
  }
}
