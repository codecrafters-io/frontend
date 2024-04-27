import { attr, belongsTo } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import Model from '@ember-data/model';
import config from 'codecrafters-frontend/config/environment';
import type UserModel from 'codecrafters-frontend/models/user';

export default class Charge extends Model {
  @attr('number') declare amount: number;
  @attr('number') declare amountRefunded: number;
  @attr('date') declare createdAt: Date;
  @attr('string') declare currency: string;
  @attr('string') declare invoiceId: string;
  @attr('string') declare status: string;

  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;

  @equal('status', 'failed') declare statusIsFailed: boolean;
  @equal('status', 'pending') declare statusIsPending: boolean;
  @equal('status', 'succeeded') declare statusIsSucceeded: boolean;

  get amountInDollars() {
    return this.amount / 100;
  }

  get amountRefundedInDollars() {
    return this.amountRefunded / 100;
  }

  get invoiceDownloadUrl() {
    if (!this.invoiceId) {
      return null;
    }

    return `${config.x.backendUrl}/invoices/${this.invoiceId}/download`;
  }
}
