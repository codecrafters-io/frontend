import ConceptModel from 'codecrafters-frontend/models/concept';
import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class ConceptsController extends Controller {
  declare model: {
    concepts: ConceptModel[];
  };

  @tracked isCreatingConcept = false;

  @service declare store: Store;
  @service declare router: RouterService;
  @service declare authenticator: AuthenticatorService;

  get shouldShowCreateConceptButton(): boolean {
    if (!this.authenticator.currentUser) {
      return false;
    }

    return this.authenticator.currentUser.isConceptAuthor || this.authenticator.currentUser.isStaff;
  }

  @action
  async handleCreateConceptButtonClicked() {
    this.isCreatingConcept = true;

    const concept = this.store.createRecord('concept');
    await concept.save();
    this.router.transitionTo('concept-admin.basic-details', concept.slug);
  }
}
