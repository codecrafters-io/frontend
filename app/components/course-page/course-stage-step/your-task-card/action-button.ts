import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    text: string;
    icon: string;
  };
}

export default class ActionButton extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::YourTaskCard::ActionButton': typeof ActionButton;
  }
}
