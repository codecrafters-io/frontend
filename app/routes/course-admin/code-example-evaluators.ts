import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CommunitySolutionEvaluatorModel from 'codecrafters-frontend/models/community-solution-evaluator';

export type CodeExampleEvaluatorsRouteModel = {
  course: CourseModel;
  evaluators: CommunitySolutionEvaluatorModel[];
};

export default class CodeExampleEvaluatorsRoute extends BaseRoute {
  @service declare store: Store;

  async model(): Promise<CodeExampleEvaluatorsRouteModel> {
    // @ts-expect-error modelFor not typed
    const course = this.modelFor('course-admin').course;

    const evaluators = await this.store.query('community-solution-evaluator', {
      include: ['course', 'language'].join(','),
    });

    return {
      course: course,
      evaluators: evaluators as unknown as CommunitySolutionEvaluatorModel[],
    };
  }
}
