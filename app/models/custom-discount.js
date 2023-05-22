import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CustomDiscount extends Model {
  @belongsTo('user', { async: false, inverse: 'customDiscounts' }) user;

  @attr('date') expiresAt;
  @attr('string') status;
  @attr('number') discountedYearlyPriceInCents;

  get discountedYearlyPriceInDollars() {
    return this.discountedYearlyPriceInCents / 100;
  }

  get isAvailable() {
    return this.status === 'unused' && this.expiresAt > new Date();
  }
}
