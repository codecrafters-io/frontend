import Model, { attr, belongsTo } from '@ember-data/model';
import type PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';
import type RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';

export default class IndividualCheckoutSessionModel extends Model {
  @attr('boolean') declare extraInvoiceDetailsRequested: boolean;
  @attr('string') declare pricingFrequency: string;
  @attr('string') declare successUrl: string;
  @attr('string') declare cancelUrl: string;
  @attr('string') declare url: string;

  @belongsTo('regional-discount', { async: false, inverse: null }) declare regionalDiscount: RegionalDiscountModel;
  @belongsTo('promotional-discount', { async: false, inverse: null }) declare promotionalDiscount: PromotionalDiscountModel;
}
