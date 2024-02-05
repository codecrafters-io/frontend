import * as Sentry from '@sentry/ember';
import Service from '@ember/service';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class FocusService extends Service {
  @service declare store: Store;
  @tracked isFocused;
  callbacks: Record<string, (isVisible: boolean) => void> = {};

  constructor() {
    super();

    this.isFocused = document.hasFocus();
    this.setupFocusChangeEventHandlers();
  }

  get isUnfocused() {
    return !this.isFocused;
  }

  @action
  deregisterCallback(callbackId: string) {
    delete this.callbacks[callbackId];
  }

  @action
  fireCallbacks() {
    for (const callbackId in this.callbacks) {
      try {
        this.callbacks[callbackId]!(this.isFocused);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error);
      }
    }
  }

  @action
  registerCallback(callback: (isFocused: boolean) => void) {
    const callbackId = Math.random().toString();
    this.callbacks[callbackId] = callback;

    return callbackId;
  }

  setupFocusChangeEventHandlers() {
    window.addEventListener('focus', () => {
      this.isFocused = document.hasFocus();
      this.fireCallbacks();
    });

    window.addEventListener('blur', () => {
      this.isFocused = document.hasFocus();
      this.fireCallbacks();
    });
  }
}
