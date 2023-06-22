import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';

export default class UpcomingPaymentSectionComponent extends Component {
  rippleSpinnerImage = rippleSpinnerImage;

  @tracked isLoading = true;
  @tracked nextInvoicePreview;
  @service authenticator;

  @action
  async handleDidInsert() {
    this.nextInvoicePreview = await this.authenticator.currentUser.fetchNextInvoicePreview();
    this.isLoading = false;
  }
}
