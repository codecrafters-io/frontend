import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    emoji: string;
    isSelected: boolean;
  };
};

export default class FeedbackPromptOptionComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::YourTaskCard::FeedbackPromptOption': typeof FeedbackPromptOptionComponent;
  }
}
