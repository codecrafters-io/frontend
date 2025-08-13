import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    emoji: string;
    isSelected: boolean;
    colorOnHoverAndSelect: 'green' | 'red';
  };
}

export default class FeedbackPromptOption extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::FeedbackPromptOption': typeof FeedbackPromptOption;
  }
}
