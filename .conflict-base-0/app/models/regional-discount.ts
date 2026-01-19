import Model, { attr } from '@ember-data/model';
import { collectionAction } from 'ember-api-actions';

export default class RegionalDiscountModel extends Model {
  @attr('number') declare percentOff: number;
  @attr('string') declare countryName: string;

  declare fetchCurrent: (this: Model, payload: unknown) => Promise<unknown>;

  computeDiscountedPrice(price: number) {
    return price - (price * this.percentOff) / 100;
  }
}

RegionalDiscountModel.prototype.fetchCurrent = collectionAction({
  path: 'current',
  type: 'get',
  urlType: 'findRecord',

  after(response) {
    if (response.data) {
      this.store.pushPayload(response);

      return this.store.peekRecord('regional-discount', response.data.id);
    } else {
      return null;
    }
  },
});
