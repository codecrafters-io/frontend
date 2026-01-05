import Component from '@glimmer/component';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    step: StepDefinition;
  };
}

export default class StepStatusPill extends Component<Signature> {
  get shouldShowMembershipRequiredState() {
    if (this.args.step.type !== 'CourseStageStep') {
      return false;
    }

    const step = this.args.step as CourseStageStep;

    return step.status === 'in_progress' && step.courseStage.isPaid && !step.repository.user.canAttemptCourseStage(step.courseStage);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::StepStatusPill': typeof StepStatusPill;
  }
}
