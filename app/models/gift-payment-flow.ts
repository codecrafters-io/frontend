import Model, { attr } from '@ember-data/model';

export default class GiftPaymentFlowModel extends Model {
  @attr('string') declare giftMessage: string;
  @attr('string') declare senderEmailAddress: string;
}
