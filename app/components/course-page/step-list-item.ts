import Component from '@glimmer/component';
import Step from 'codecrafters-frontend/utils/course-page-step-list/step';

import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    sidebarIsExpanded: boolean;
    step: Step;
    isActive: boolean;
    isCurrent: boolean;
  };
}

export default class StepListItemComponent extends Component<Signature> {
  fade = fade;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::StepListItem': typeof StepListItemComponent;
  }
}
