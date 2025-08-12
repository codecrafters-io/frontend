import Component from '@glimmer/component';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    inaccessibleSolutions: CommunityCourseStageSolutionModel[];
  };
}

export default class InaccessibleCommunitySolutionsList extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::InaccessibleCommunitySolutionsList': typeof InaccessibleCommunitySolutionsList;
  }
}
