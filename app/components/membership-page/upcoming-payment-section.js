import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class UpcomingPaymentSectionComponent extends Component {
  @tracked isLoading = true;
  @tracked nextInvoicePreview;
  @service('current-user') currentUserService;

  @action
  async handleDidInsert() {
    this.nextInvoicePreview = await this.currentUserService.record.fetchNextInvoicePreview();
    this.isLoading = false;
  }
}
