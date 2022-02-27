import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import * as Sentry from '@sentry/ember';
import Component from '@glimmer/component';
import window from 'ember-window-mock';

export default class CheckoutSessionSuccessfulModalComponent extends Component {
  @service('globalModals') globalModalsService;
  @service store;

  @action
  async handleDidInsert() {
    let attempts = 0;

    while (attempts < 60) {
      try {
        let subscriptions = await this.store.findAll('subscription');

        if (subscriptions.firstObject) {
          this.globalModalsService.closeModals();

          return;
        }
      } catch (e) {
        console.log('error when fetching subscriptions', e);
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    Sentry.captureMessage('Failed to load subscriptions after 60 attempts');
    window.location.reload();
  }
}
