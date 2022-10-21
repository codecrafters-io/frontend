import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class InvoiceModel extends Model {
  @attr('number') amountDue;
  @attr('date') createdAt;

  // Structure:
  //   - amount: number
  //   - quantity: number
  @attr('') lineItems;

  get amountDueInDollars() {
    return this.amountDue / 100;
  }
}
