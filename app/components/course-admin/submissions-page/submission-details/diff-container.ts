import Component from '@glimmer/component';
import type SubmissionModel from 'codecrafters-frontend/models/submission';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    submission: SubmissionModel;
  };
}

export default class DiffContainerComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::SubmissionsPage::SubmissionDetails::DiffContainer': typeof DiffContainerComponent;
  }
}
