import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    description: string;
    icon: string;
  };
}

export default class TrackPageHeaderStatistic extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::Header::Statistic': typeof TrackPageHeaderStatistic;
  }
}
