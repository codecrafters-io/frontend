import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import fade from 'ember-animated/transitions/fade';
import Component from '@glimmer/component';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';

export default class RecentPaymentsSectionComponent extends Component {
  rippleSpinnerImage = rippleSpinnerImage;
  @tracked charges = [];
  @tracked isLoading = true;
  @service store;
  transition = fade;

  @action
  async handleDidInsert() {
    this.charges = await this.store.findAll('charge');
    this.isLoading = false;
  }
}
