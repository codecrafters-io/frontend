import BaseRoute from 'codecrafters-frontend/utils/base-route';
import config from 'codecrafters-frontend/config/environment';
import { inject as service } from '@ember/service';
import { loadStripe } from '@stripe/stripe-js';
import type Store from '@ember-data/store';
import type TeamsPayController from 'codecrafters-frontend/controllers/teams/pay';
import type TeamPaymentFlowModel from 'codecrafters-frontend/models/team-payment-flow';
import type Transition from '@ember/routing/transition';

export default class TeamsPayRoute extends BaseRoute {
  @service declare store: Store;

  allowsAnonymousAccess = true;

  async model(params: { teamPaymentFlowId?: string }): Promise<TeamPaymentFlowModel> {
    if (params.teamPaymentFlowId) {
      return await this.store.findRecord('team-payment-flow', params.teamPaymentFlowId);
    } else {
      return this.store.createRecord('team-payment-flow', { pricingPlanType: 'yearly', numberOfSeats: 10 });
    }
  }

  setupController(controller: TeamsPayController, model: TeamPaymentFlowModel, transition: Transition) {
    super.setupController(controller, model, transition);

    controller.currentStep = controller.initialStep;

    // Trigger stripe loading as soon as page loads
    loadStripe(config.x.stripePublishableKey);
  }
}
