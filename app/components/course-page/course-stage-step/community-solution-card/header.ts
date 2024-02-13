import Component from '@glimmer/component';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    solution: CommunityCourseStageSolutionModel;
    isExpanded: boolean;
    onCollapseButtonClick: () => void;
    positionInList: number; // TEMP FOR DEMO
  };
};

export default class CommunitySolutionCardHeaderComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::Header': typeof CommunitySolutionCardHeaderComponent;
  }
}
