import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import type ConceptModel from 'codecrafters-frontend/models/concept';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type { ModelType as CourseStageModelType } from 'codecrafters-frontend/routes/course/stage';

export interface ModelType {
  allConcepts: ConceptModel[];
  courseStage: CourseStageModel | undefined;
}

export default class CodeExamplesRoute extends BaseRoute {
  @service declare store: Store;

  async model(): Promise<ModelType> {
    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('concept-engagement', {
        include: 'concept,user',
      });
    }

    return {
      allConcepts: (await this.store.findAll('concept', { include: 'author,questions' })) as unknown as ConceptModel[],
      courseStage: (this.modelFor('course.stage') as CourseStageModelType).courseStage,
    };
  }
}
