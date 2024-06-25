import ConceptModel from 'codecrafters-frontend/models/concept';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import type UserModel from 'codecrafters-frontend/models/user';

export default class ConceptsController extends Controller {
  declare model: {
    concepts: ConceptModel[];
  };

  @tracked isCreatingConcept = false;

  @service declare store: Store;
  @service declare router: RouterService;
  @service declare authenticator: AuthenticatorService;

  get currentUser(): UserModel | null {
    return this.authenticator.currentUser as UserModel;
  }

  get shouldShowCreateConceptButton(): boolean {
    if (!this.currentUser) {
      return false;
    }

    return this.currentUser.isConceptAuthor || this.currentUser.isStaff;
  }

  get visibleConcepts(): ConceptModel[] {
    return this.model.concepts.filter((concept) => {
      const canViewDraft = this.currentUser && this.currentUser.isStaff || concept.author === this.currentUser;

      return concept.statusIsPublished || (concept.statusIsDraft && canViewDraft);
    });
  }

  @action
  async handleCreateConceptButtonClicked() {
    this.isCreatingConcept = true;

    const concept = this.store.createRecord('concept');
    await concept.save();
    this.router.transitionTo('concept-admin.basic-details', concept.slug);
  }
}
