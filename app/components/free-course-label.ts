import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';

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

export default class FreeCourseLabelComponent extends Component<Signature> {
  get labelCopy(): string {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    if (today.getTime() < firstDayOfMonth.getTime() + 24 * 60 * 60 * 1000) {
      return 'FREE THIS MONTH';
    } else {
      return 'FREE'
    }
  }

  get tooltipCopy(): string {
    return `We're keeping this course free until ${this.args.course.isFreeUntil} to gather feedback`
  }

  get tooltipSide(): 'top' | 'bottom' | 'left' | 'right' {
    return this.args.tooltipSide || 'top';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FreeCourseLabel: typeof FreeCourseLabelComponent;
  }
}
