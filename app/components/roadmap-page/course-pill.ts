import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    isSelected: boolean;
  };
}

export default class CoursePill extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'RoadmapPage::CoursePill': typeof CoursePill;
  }
}
