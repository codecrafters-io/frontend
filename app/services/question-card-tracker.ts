import Component from '@glimmer/component';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class QuestionCardTrackerService extends Service {
  @tracked latestComponent: Component | null = null;

  isComponentLatest(component: Component) {
    return this.latestComponent === component;
  }

  registerComponent(component: Component) {
    this.latestComponent = component;
  }

  unregisterComponent(component: Component) {
    if (this.latestComponent === component) {
      this.latestComponent = null;
    }
  }
}
