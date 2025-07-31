import Component from '@glimmer/component';
import type CommunityCourseStageSolution from 'codecrafters-frontend/models/community-course-stage-solution';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    changedFile: CommunityCourseStageSolution['changedFiles'][number];
    onPublishToGithubButtonClick: () => void;
    solution: CommunityCourseStageSolution;
  };
}

export default class ChangedFileCardComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::ChangedFileCard': typeof ChangedFileCardComponent;
  }
}
