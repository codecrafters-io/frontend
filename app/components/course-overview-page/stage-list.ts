import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Args: {
    course: CourseModel;
  };
}

export default class StageListComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::StageList': typeof StageListComponent;
  }
}
