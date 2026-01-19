import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import { format } from 'date-fns';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
  };

  Blocks: {
    default: [];
  };
}

export default class FreeCourseLabel extends Component<Signature> {
  get tooltipCopy(): string {
    return `This challenge is free until ${format(this.args.course.isFreeUntil as Date, 'd MMMM yyyy')}!`;
  }

  get tooltipSide(): 'top' | 'bottom' | 'left' | 'right' {
    return this.args.tooltipSide || 'top';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FreeCourseLabel: typeof FreeCourseLabel;
  }
}
