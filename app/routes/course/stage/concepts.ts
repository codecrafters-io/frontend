import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { service } from '@ember/service';
import type Store from '@ember-data/store';

export default class ConceptsRoute extends BaseRoute {
  @service declare store: Store;

  async model() {
    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('concept-engagement', {
        include: 'concept,user',
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const courseStageRouteModel = this.modelFor('course.stage') as { courseStage: any };

    return {
      allConcepts: await this.store.findAll('concept', { include: 'author,questions' }),
      courseStage: courseStageRouteModel.courseStage,
    };
  }
}
