import Controller from '@ember/controller';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';

export default class CodeExampleController extends Controller {
  declare model: {
    solution: CommunityCourseStageSolutionModel;
  };
}
