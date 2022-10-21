import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class InvoiceModel extends Model {
  @attr('date') createdAt;
  @attr('number') total;

  // Structure:
  //   - amount: number
  //   - quantity: number
  @attr('') lineItems;

  get totalAmountInDollars() {
    return this.total / 100;
  }
}
