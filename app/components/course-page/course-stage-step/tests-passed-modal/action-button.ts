import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    icon: string;
    title: string;
    description: string;
  };
}

export default class TestsPassedModalActionButton extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestsPassedModal::ActionButton': typeof TestsPassedModalActionButton;
  }
}
