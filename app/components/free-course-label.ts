import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    course?: CourseModel;
    tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
  };

  Blocks: {
    default: [];
  };
}

export default class FreeCourseLabelComponent extends Component<Signature> {
  get tooltipSide(): 'top' | 'bottom' | 'left' | 'right' {
    return this.args.tooltipSide || 'top';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FreeCourseLabel: typeof FreeCourseLabelComponent;
  }
}
