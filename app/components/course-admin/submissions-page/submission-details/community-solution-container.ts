import Component from '@glimmer/component';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type SubmissionModel from 'codecrafters-frontend/models/submission';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    submission: SubmissionModel;
  };
}

export default class CommunitySolutionContainer extends Component<Signature> {
  get communitySolution(): CommunityCourseStageSolutionModel | null {
    return this.args.submission.communitySolution;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::SubmissionsPage::SubmissionDetails::CommunitySolutionContainer': typeof CommunitySolutionContainer;
  }
}
