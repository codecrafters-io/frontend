import Controller from '@ember/controller';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type SolutionComparisonModel from 'codecrafters-frontend/models/solution-comparison';

export default class CodeExampleController extends Controller {
  declare model: {
    solution: CommunityCourseStageSolutionModel;
    comparisons: SolutionComparisonModel[];
  };
}
