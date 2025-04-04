import * as Sentry from '@sentry/ember';
import Service, { inject as service } from '@ember/service';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class VisibilityService extends Service {
  @service declare store: Store;
  @tracked isVisible;
  callbacks: Record<string, (isVisible: boolean) => void> = {};

  constructor(...args: [object | undefined] | []) {
    super(...args);

    this.isVisible = true;
    this.setupVisibilityChangeEventHandlers();
  }

  get isHidden() {
    return !this.isVisible;
  }

  @action
  deregisterCallback(callbackId: string) {
    delete this.callbacks[callbackId];
  }

  @action
  fireCallbacks() {
    for (const callbackId in this.callbacks) {
      try {
        this.callbacks[callbackId]!(this.isVisible);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error);
      }
    }
  }

  @action
  registerCallback(callback: (isVisible: boolean) => void) {
    const callbackId = Math.random().toString();
    this.callbacks[callbackId] = callback;

    return callbackId;
  }

  setupVisibilityChangeEventHandlers() {
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      this.fireCallbacks();
    });
  }
}
