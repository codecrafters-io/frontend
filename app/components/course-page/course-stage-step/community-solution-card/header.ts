import Component from '@glimmer/component';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    contentIsExpanded: boolean;
    diffSource: 'changed-files' | 'highlighted-files';
    metadataForDownvote?: Record<string, unknown>;
    metadataForUpvote?: Record<string, unknown>;
    onCollapseButtonClick: () => void;
    onDiffSourceChange: (diffSource: 'changed-files' | 'highlighted-files') => void;
    solution: CommunityCourseStageSolutionModel;
  };
}

export default class CommunitySolutionCardHeader extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::Header': typeof CommunitySolutionCardHeader;
  }
}
