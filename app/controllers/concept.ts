import Controller from '@ember/controller';
import { action } from '@ember/object';
import type { ConceptRouteModel } from 'codecrafters-frontend/routes/concept';
import type ConceptEngagementModel from 'codecrafters-frontend/models/concept-engagement';
import { next } from '@ember/runloop';

export default class ConceptController extends Controller {
  declare model: ConceptRouteModel;

  @action
  async handleEngagementCreate(engagement: ConceptEngagementModel) {
    console.log('Engagement created in concept controller', engagement);
    this.model.latestConceptEngagement = engagement;

    await new Promise((resolve) => {
      next(() => {
        this.model.latestConceptEngagement = engagement;
        resolve(undefined);
      });
    });
  }
}
