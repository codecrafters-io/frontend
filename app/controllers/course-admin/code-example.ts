import Controller from '@ember/controller';
import { action } from '@ember/object';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type SolutionComparisonModel from 'codecrafters-frontend/models/solution-comparison';

export default class CodeExampleController extends Controller {
  declare model: {
    solution: CommunityCourseStageSolutionModel;
    comparisons: SolutionComparisonModel[];
  };

  @action
  handlePinCodeExampleToggled() {
    this.model.solution.isPinned = !this.model.solution.isPinned;
    this.model.solution.save();
  }
}
