import { attr, belongsTo } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import Model from '@ember-data/model';

export default class Charge extends Model {
  @attr('date') createdAt;
  @attr('number') amount;
  @attr('number') amountRefunded;
  @attr('string') currency;
  @attr('string') invoiceId;
  @attr('string') status;

  @belongsTo('user', { async: false, inverse: null }) user;

  @equal('status', 'failed') statusIsFailed;
  @equal('status', 'pending') statusIsPending;
  @equal('status', 'succeeded') statusIsSucceeded;

  get amountInDollars() {
    return this.amount / 100;
  }

  get amountRefundedInDollars() {
    return this.amountRefunded / 100;
  }
}
