import Component from '@glimmer/component';

type Signature = {
  Element: HTMLButtonElement;

  Args: {
    text: string;
    icon: string;
  };
};

export default class ActionButtonComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::YourTaskCard::ActionButton': typeof ActionButtonComponent;
  }
}
