import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    description: string | null;
    isError?: boolean;
    title: string;
  };

  Blocks: {
    default: [];
  };
}

export default class CourseInterviewPageStatusScreen extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::StatusScreen': typeof CourseInterviewPageStatusScreen;
  }
}
