import BaseRoute from 'codecrafters-frontend/lib/base-route';
import RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';

export default class ConceptAdminIndexRoute extends BaseRoute {
  @service declare router: RouterService;

  redirect() {
    const conceptSlug = (this.paramsFor('concept-admin') as { concept_slug: string }).concept_slug;

    if (!conceptSlug) {
      throw new Error('Concept slug is missing');
    }

    this.router.transitionTo('concept-admin.blocks', conceptSlug);
  }
}
