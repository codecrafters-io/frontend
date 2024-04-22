import Component from '@glimmer/component';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: CourseStageStep;
    isCollapsible: boolean;
    isExpanded: boolean;
    onCollapseButtonClick: () => void;
    textColorClasses: string;
  };
}

export default class HeaderComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestRunnerCard::Header': typeof HeaderComponent;
  }
}
