import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import type ConceptEngagementModel from 'codecrafters-frontend/models/concept-engagement';
import type { ConceptRouteModel } from 'codecrafters-frontend/routes/concept';

export default class ConceptController extends Controller {
  @tracked declare latestConceptEngagement: ConceptEngagementModel;
  declare model: ConceptRouteModel;
}
