import Model, { attr } from '@ember-data/model';

export default class IndividualPaymentMethodUpdateRequestModel extends Model {
  @attr('string') declare url: string;
}
