import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class TeamPaymentFlowModel extends Model {
  @attr('string') teamName;
  @attr('string') contactEmailAddress;
  @attr('string') pricingPlan; // per_seat, per_user
  @attr('number') numberOfSeats;

  get contactEmailAddressIsComplete() {
    return this.contactEmailAddress && this.contactEmailAddress.trim().length > 0;
  }

  get teamNameIsComplete() {
    return this.teamName && this.teamName.trim().length > 0;
  }

  get numberOfSeatsIsComplete() {
    return this.numberOfSeats && this.numberOfSeats >= 5;
  }

  get pricingPlanIsComplete() {
    return ['per_seat', 'per_user'].includes(this.pricingPlan);
  }
}
