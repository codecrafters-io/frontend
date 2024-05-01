import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class InvoiceModel extends Model {
  @attr('number') declare amountDue: number;
  @attr('date') declare createdAt: Date;
  @attr() declare lineItems: { amount: number; amount_after_discounts: number; quantity: number }[];

  get amountDueInDollars() {
    return this.amountDue / 100;
  }
}
