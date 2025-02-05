import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    lastPushedRepository?: RepositoryModel;
  };
}

export default class ProgressBarComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::CourseCard::ProgressBar': typeof ProgressBarComponent;
  }
}
