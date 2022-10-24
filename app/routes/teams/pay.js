import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import { loadStripe } from '@stripe/stripe-js';
import { inject as service } from '@ember/service';

export default class TeamsPayRoute extends ApplicationRoute {
  @service store;
  @service serverVariables;

  allowsAnonymousAccess = true;

  async model(params) {
    if (params.teamPaymentFlowId) {
      return await this.store.findRecord('team-payment-flow', params.teamPaymentFlowId);
    } else {
      return this.store.createRecord('team-payment-flow', { pricingPlanType: 'monthly', numberOfSeats: 10 });
    }
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    controller.currentStep = controller.initialStep;

    // Trigger stripe loading as soon as page loads
    loadStripe(this.serverVariables.get('stripePublishableKey'));
  }
}
