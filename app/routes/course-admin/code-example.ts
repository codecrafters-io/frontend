import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type SolutionComparisonModel from 'codecrafters-frontend/models/solution-comparison';
import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';
import type CourseModel from 'codecrafters-frontend/models/course';

export type CodeExampleRouteModel = {
  course: CourseModel;
  comparisons: SolutionComparisonModel[];
  evaluations: CommunitySolutionEvaluationModel[];
  solution: CommunityCourseStageSolutionModel;
};

export default class CodeExampleRoute extends BaseRoute {
  @service declare store: Store;

  async model(params: { code_example_id: string }): Promise<CodeExampleRouteModel> {
    // @ts-ignore
    const course = this.modelFor('course-admin').course;

    // Include trusted evaluations for admin UI
    const solutionIncludes = [...CommunityCourseStageSolutionModel.defaultIncludedResources, 'trusted-evaluations'];

    const [solution, comparisons, evaluations, trustedEvaluations] = await Promise.all([
      // Solution
      this.store.findRecord('community-course-stage-solution', params.code_example_id, {
        include: solutionIncludes.join(','),
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
      this.store.query('community-solution-evaluation', {
        community_solution_id: params.code_example_id,
        include: ['community-solution', 'evaluator'].join(','),
      }),

      // Trusted evaluations
      this.store.query('trusted-community-solution-evaluation', {
        course_id: course.id, 
        // TODO: we might open this page from the "wrong" course's admin page
        // For now, later on we should add an index page for all code examples
        community_solution_id: params.code_example_id,
        include: ['community-solution', 'evaluator'].join(','),
      }),
    ]);

    let allEvaluations = evaluations.toArray();
    allEvaluations = allEvaluations.concat(trustedEvaluations);

    return {
      course: course,
      comparisons: comparisons as unknown as SolutionComparisonModel[],
      evaluations: allEvaluations as CommunitySolutionEvaluationModel[],
      solution: solution,
    };
  }
}
