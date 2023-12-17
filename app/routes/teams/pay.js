import BaseRoute from 'codecrafters-frontend/utils/base-route';
import config from 'codecrafters-frontend/config/environment';
import { inject as service } from '@ember/service';
import { loadStripe } from '@stripe/stripe-js';

export default class TeamsPayRoute extends BaseRoute {
  @service store;

  allowsAnonymousAccess = true;

  async model(params) {
    if (params.teamPaymentFlowId) {
      return await this.store.findRecord('team-payment-flow', params.teamPaymentFlowId);
    } else {
      return this.store.createRecord('team-payment-flow', { pricingPlanType: 'yearly', numberOfSeats: 10 });
    }
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    controller.currentStep = controller.initialStep;

    // Trigger stripe loading as soon as page loads
    loadStripe(config.x.stripePublishableKey);
  }
}
