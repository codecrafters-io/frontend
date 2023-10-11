import ConceptModel from 'codecrafters-frontend/models/concept';
import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ConceptsController extends Controller {
  declare model: {
    concepts: ConceptModel[];
  };

  @tracked isCreatingConcept = false;

  @service declare store: Store;
  @service declare router: RouterService;

  @action
  async handleCreateConceptButtonClicked() {
    this.isCreatingConcept = true;

    const concept = this.store.createRecord('concept');
    await concept.save();
    this.router.transitionTo('concept-admin.basic-details', concept.slug);
  }
}
