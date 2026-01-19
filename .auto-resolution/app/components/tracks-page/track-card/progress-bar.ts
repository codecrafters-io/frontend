import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    stagesCount: number;
    completedStagesCount: number;
  };
}

export default class ProgressBar extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TracksPage::TrackCard::ProgressBar': typeof ProgressBar;
  }
}
