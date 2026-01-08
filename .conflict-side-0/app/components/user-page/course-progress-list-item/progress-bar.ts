import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    completedStagesCount: number;
    totalStagesCount: number;
  };
}

export default class ProgressBar extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'UserPage::CourseProgressListItem::ProgressBar': typeof ProgressBar;
  }
}
