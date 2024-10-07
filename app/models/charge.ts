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
    return Charge.buildDisplayString(this.amount, this.currency);
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

  get refundedAmountDisplayString() {
    return Charge.buildDisplayString(this.amountRefunded, this.currency);
  }

  static buildDisplayString(amount: number, currency: string) {
    const normalizedAmount = ZERO_DECIMAL_CURRENCIES.includes(currency.toUpperCase()) ? amount : amount / 100;

    if (currency === 'usd') {
      return `$${normalizedAmount}`;
    } else if (currency === 'eur') {
      return `€${normalizedAmount}`;
    } else if (currency === 'gbp') {
      return `£${normalizedAmount}`;
    } else if (currency === 'jpy') {
      return `¥${normalizedAmount}`;
    } else if (currency === 'cny') {
      return `CN¥${normalizedAmount}`;
    } else if (currency === 'chf') {
      return `CHF ${normalizedAmount}`;
    } else if (currency === 'cad') {
      return `C$${normalizedAmount}`;
    } else if (currency === 'aud') {
      return `A$${normalizedAmount}`;
    } else if (currency === 'hkd') {
      return `HK$${normalizedAmount}`;
    } else if (currency === 'sgd') {
      return `S$${normalizedAmount}`;
    } else if (currency === 'inr') {
      return `₹${normalizedAmount}`;
    }

    return `${normalizedAmount} ${currency.toUpperCase()}`;
  }
}
