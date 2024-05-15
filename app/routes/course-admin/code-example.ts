import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type SolutionComparisonModel from 'codecrafters-frontend/models/solution-comparison';
import type CodeExampleEvaluationModel from 'codecrafters-frontend/models/code-example-evaluation';
import type CourseModel from 'codecrafters-frontend/models/course';

export type CodeExampleRouteModel = {
  course: CourseModel;
  comparisons: SolutionComparisonModel[];
  evaluations: CodeExampleEvaluationModel[];
  solution: CommunityCourseStageSolutionModel;
};

export default class CodeExampleRoute extends BaseRoute {
  @service declare store: Store;

  async model(params: { code_example_id: string }): Promise<CodeExampleRouteModel> {
    // @ts-ignore
    const course = this.modelFor('course-admin').course;

    const [solution, comparisons, evaluations] = await Promise.all([
      // Solution
      this.store.findRecord('community-course-stage-solution', params.code_example_id, {
        include: CommunityCourseStageSolutionModel.defaultIncludedResources.join(','),
      }),

      // Comparisons
      this.store.query('solution-comparison', {
        solution_id: params.code_example_id,
        include: [
          'first-solution',
          'second-solution',
          ...CommunityCourseStageSolutionModel.defaultIncludedResources.map((resource) => `first-solution.${resource}`),
          ...CommunityCourseStageSolutionModel.defaultIncludedResources.map((resource) => `second-solution.${resource}`),
        ].join(','),
      }),

      // Evaluations
      this.store.query('code-example-evaluation', {
        code_example_id: params.code_example_id,
        include: ['code-example'].join(','),
      }),
    ]);

    return {
      course: course,
      comparisons: comparisons as unknown as SolutionComparisonModel[],
      evaluations: evaluations as unknown as CodeExampleEvaluationModel[],
      solution: solution,
    };
  }
}
