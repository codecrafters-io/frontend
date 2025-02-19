import Controller from '@ember/controller';
import { action } from '@ember/object';
import type { ConceptRouteModel } from 'codecrafters-frontend/routes/concept';
import type ConceptEngagementModel from 'codecrafters-frontend/models/concept-engagement';
import type ConceptRoute from 'codecrafters-frontend/routes/concept';
// import { next } from '@ember/runloop';

export default class ConceptController extends Controller {
  declare model: ConceptRouteModel;
  declare route: ConceptRoute;

  @action
  async handleEngagementCreate(engagement: ConceptEngagementModel) {
    console.log('Engagement created in concept controller', engagement);
    // this.model.latestConceptEngagement = engagement;

    // await new Promise((resolve) => {
    //   next(() => {
    //     this.model.latestConceptEngagement = engagement;
    //     resolve(undefined);
    //   });
    // });

    // this.model = { 
    //   ...this.model, 
    //   latestConceptEngagement: engagement 
    // };

    // Refresh the route model to get updated engagement
    const model = await this.route.model({ concept_slug: this.model.concept.slug });
    this.model = {
      ...model,
      allConcepts: model.allConcepts.toArray(),  // Convert ArrayProxy to ConceptModel[]
      latestConceptEngagement: engagement
    };
    
    // Force update by creating new object
    this.notifyPropertyChange('model');
  }
}
