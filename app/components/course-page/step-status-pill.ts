import Component from '@glimmer/component';
import StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    step: StepDefinition;
  };
}

export default class StepStatusPillComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::StepStatusPill': typeof StepStatusPillComponent;
  }
}
