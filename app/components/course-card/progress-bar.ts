import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    lastUsedRepository: RepositoryModel;
  };
}

export default class ProgressBar extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseCard::ProgressBar': typeof ProgressBar;
  }
}
