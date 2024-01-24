import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import DateService from 'codecrafters-frontend/services/date';
import { format } from 'date-fns';
import { inject as service } from '@ember/service';

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
  @service declare date: DateService;

  get labelCopy(): string {
    const now = this.date.now();
    const today = new Date(now);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    if (now < firstDayOfMonth.getTime() + 24 * 60 * 60 * 1000) {
      return 'FREE THIS MONTH';
    } else {
      return 'FREE'
    }
  }

  get tooltipCopy(): string {
    return `We're keeping this course free until ${format(this.args.course.isFreeUntil as Date, 'd MMMM yyyy')} to gather feedback`
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
