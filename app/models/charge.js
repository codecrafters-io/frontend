import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class Charge extends Model {
  @attr('date') createdAt;
  @attr('number') amount;
  @attr('string') currency;
  @attr('string') invoiceId;
  @belongsTo('user') user;

  get amountInDollars() {
    return this.amount / 100;
  }
}
