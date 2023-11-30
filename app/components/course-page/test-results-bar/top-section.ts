import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    onCollapseButtonClick: () => void;
  };
};

export default class TopSectionComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::TopSection': typeof TopSectionComponent;
  }
}
