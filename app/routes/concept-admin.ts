import Store from '@ember-data/store';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import ConceptModel from 'codecrafters-frontend/models/concept';
import AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class CourseAdminRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;

  async beforeModel(...args: unknown[]) {
    // @ts-ignore
    await super.beforeModel(...args);

    await this.authenticator.authenticate();

    if (!this.authenticator.currentUser!.isStaff) {
      this.router.transitionTo('catalog');
    }
  }

  async model(params: { concept_slug: string }) {
    const allConcepts = (await this.store.findAll('concept', { include: 'questions' })) as unknown as ConceptModel[];

    return {
      concept: allConcepts.find((concept) => concept.slug === params.concept_slug),
    };
  }
}
