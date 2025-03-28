import Component from '@glimmer/component';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: CourseStageStep;
  };
}

export default class TestsPassedInstructionsComponent extends Component<Signature> {
  get tabs() {
    return [
      {
        slug: 'mark-as-complete',
        title: 'Move to next step',
      },
      {
        slug: 'refactor',
        title: 'Refactor code',
      },
    ];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestRunnerCard::TestsPassedInstructions': typeof TestsPassedInstructionsComponent;
  }
}
