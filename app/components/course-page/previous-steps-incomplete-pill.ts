import Component from '@glimmer/component';
import { service } from '@ember/service';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';

interface Signature {
  Element: HTMLDivElement;
}

export default class PreviousStepsIncompletePill extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;

  get activeStep() {
    return this.coursePageState.activeStep;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::PreviousStepsIncompletePill': typeof PreviousStepsIncompletePill;
  }
}
