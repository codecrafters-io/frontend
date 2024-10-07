import Model, { attr, belongsTo } from '@ember-data/model';
import config from 'codecrafters-frontend/config/environment';
import type UserModel from 'codecrafters-frontend/models/user';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes

const ZERO_DECIMAL_CURRENCIES = ['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'];

export default class Charge extends Model {
  @attr('number') declare amount: number;
  @attr('number') declare amountRefunded: number;
  @attr('date') declare createdAt: Date;
  @attr('string') declare currency: string;
  @attr('string') declare invoiceId: string;
  @attr('string') declare status: 'succeeded' | 'pending' | 'failed';

  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;

  @equal('status', 'failed') declare statusIsFailed: boolean;
  @equal('status', 'pending') declare statusIsPending: boolean;
  @equal('status', 'succeeded') declare statusIsSucceeded: boolean;

  get displayString() {
    if (this.currency === 'usd') {
      return `$${this.normalizedAmount}`;
    }

    return `${this.normalizedAmount} ${this.currency}`;
  }

  get invoiceDownloadUrl() {
    if (!this.invoiceId) {
      return null;
    }

    return `${config.x.backendUrl}/invoices/${this.invoiceId}/download`;
  }

  get isFullyRefunded() {
    return this.amountRefunded === this.amount;
  }

  get normalizedAmount() {
    if (ZERO_DECIMAL_CURRENCIES.includes(this.currency)) {
      return this.amount;
    }

    return this.amount / 100;
  }

  get refundedAmountDisplayString() {
    if (this.currency === 'usd') {
      return `$${this.amountRefunded / 100}`;
    }

    return `${this.amountRefunded} ${this.currency}`;
  }
}
