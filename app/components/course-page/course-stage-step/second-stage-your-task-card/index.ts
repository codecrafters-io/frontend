import Component from '@glimmer/component';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: CourseStageStep;
  };
}

export default class SecondStageYourTaskCard extends Component<Signature> {
  get instructionsMarkdown() {
    return this.args.currentStep.courseStage.buildInstructionsMarkdownFor(this.args.currentStep.repository);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SecondStageYourTaskCard': typeof SecondStageYourTaskCard;
  }
}
