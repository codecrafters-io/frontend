import Component from '@glimmer/component';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class KeydownHandlerService extends Service {
  @tracked activeComponent: Component | null = null;

  registerComponent(component: Component) {
    this.activeComponent = component;
  }

  triggerKeydownEffect(event: KeyboardEvent, handler: (key: string) => void, component: Component) {
    if (this.activeComponent === component) {
      handler(event.key);
    }
  }

  unregisterComponent(component: Component) {
    if (this.activeComponent === component) {
      this.activeComponent = null;
    }
  }
}
