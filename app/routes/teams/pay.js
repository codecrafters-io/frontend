import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import { inject as service } from '@ember/service';

export default class TeamsPayRoute extends ApplicationRoute {
  @service store;

  allowsAnonymousAccess = true;

  async model(params) {
    if (params.teamPaymentFlowId) {
      return await this.store.findRecord('team-payment-flow', params.teamPaymentFlowId);
    } else {
      return this.store.createRecord('team-payment-flow', { pricingPlan: 'per_seat', numberOfSeats: 10 });
    }
  }
}
