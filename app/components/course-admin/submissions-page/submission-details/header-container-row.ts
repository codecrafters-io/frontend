import Component from '@glimmer/component';

interface Signature {
  Args: {
    title: string;
  };
  Blocks: {
    default: [];
  };
}

export default class HeaderContainerRow extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::SubmissionsPage::SubmissionDetails::HeaderContainerRow': typeof HeaderContainerRow;
  }
}
