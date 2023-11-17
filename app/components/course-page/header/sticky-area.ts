import Component from '@glimmer/component';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';
import { StepList } from 'codecrafters-frontend/lib/course-page-step-list';
import { TemporaryCourseModel } from 'codecrafters-frontend/lib/temporary-types';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { fade } from 'ember-animated/motions/opacity';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
    course: TemporaryCourseModel;
    currentStep: Step;
    nextStep: Step | null;
    stepList: StepList;
  };
};

export default class StickyAreaComponent extends Component<Signature> {
  transition = fade;
  @tracked scrollMarkerIsInViewport = true;

  get isSticky() {
    return !this.scrollMarkerIsInViewport;
  }

  @action
  handleScrollMarkerInViewportDidChange(value: boolean) {
    this.scrollMarkerIsInViewport = value;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Header::StickyArea': typeof StickyAreaComponent;
  }
}
