import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Args: {
    course: CourseModel;
  };
}

export default class DifficultyLabel extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseCard::DifficultyLabel': typeof DifficultyLabel;
  }
}
