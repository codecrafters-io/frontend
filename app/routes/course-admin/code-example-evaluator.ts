import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CommunitySolutionEvaluatorModel from 'codecrafters-frontend/models/community-solution-evaluator';
import type RouterService from '@ember/routing/router-service';

export type CodeExampleEvaluatorRouteModel = {
  course: CourseModel;
  evaluator: CommunitySolutionEvaluatorModel;
};

export default class CodeExampleEvaluatorRoute extends BaseRoute {
  @service declare store: Store;
  @service declare router: RouterService;

  async model(params: { evaluator_slug: string }): Promise<CodeExampleEvaluatorRouteModel> {
    // @ts-expect-error modelFor not typed
    const course = this.modelFor('course-admin').course;

    const evaluators = await this.store.query('community-solution-evaluator', {
      include: ['course', 'language'].join(','),
    });

    const evaluator = evaluators.find((evaluator) => evaluator.slug === params.evaluator_slug);

    if (!evaluator) {
      this.router.transitionTo('not-found');

      return {} as CodeExampleEvaluatorRouteModel;
    }

    return {
      course: course,
      evaluator: evaluator,
    };
  }
}
