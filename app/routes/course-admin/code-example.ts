import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';
import CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';

export default class CodeExampleRoute extends BaseRoute {
  @service declare store: Store;

  async model(params: { code_example_id: string }) {
    // @ts-ignore
    const course = this.modelFor('course-admin').course;
    const solution = await this.store.findRecord('community-course-stage-solution', params.code_example_id, {
      include: CommunityCourseStageSolutionModel.defaultIncludedResources.join(','),
    });

    const comparisons = await this.store.query('solution-comparison', {
      solution_id: solution.id,
      include: [
        'first-solution',
        'second-solution',
        ...CommunityCourseStageSolutionModel.defaultIncludedResources.map((resource) => `first-solution.${resource}`),
        ...CommunityCourseStageSolutionModel.defaultIncludedResources.map((resource) => `second-solution.${resource}`),
      ].join(','),
    });

    return {
      course: course,
      comparisons: comparisons,
      solution: solution,
    };
  }
}
