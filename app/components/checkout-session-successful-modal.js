import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import window from 'ember-window-mock';
import fade from 'ember-animated/transitions/fade';

export default class CheckoutSessionSuccessfulModalComponent extends Component {
  @tracked isSyncingSubscriptions = true;
  @service('globalModals') globalModalsService;
  @service store;
  transition = fade;

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

    // TODO: Notify bugsnag!
    window.location.reload();
  }
}
