import Component from '@glimmer/component';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    step: Step;
    isActive: boolean;
    isCurrent: boolean;
  };
}

export default class StepListItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::StepListItem': typeof StepListItemComponent;
  }
}
