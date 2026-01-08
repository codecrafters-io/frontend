import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type ConceptModel from 'codecrafters-frontend/models/concept';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type { ModelType as CourseStageRouteModelType } from 'codecrafters-frontend/routes/course/stage';

export type ModelType = {
  allConcepts: ConceptModel[];
  courseStage: CourseStageModel;
};

export default class CodeExamplesRoute extends BaseRoute {
  @service declare store: Store;
  @service declare authenticator: AuthenticatorService;

  async model(): Promise<ModelType> {
    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('concept-engagement', {
        include: 'concept,user',
      });
    }

    const courseStageModel = this.modelFor('course.stage') as CourseStageRouteModelType;

    return {
      allConcepts: (await this.store.findAll('concept', { include: 'author,questions' })) as unknown as ConceptModel[],
      courseStage: courseStageModel.courseStage!,
    };
  }
}
