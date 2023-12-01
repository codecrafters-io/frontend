import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    barIsExpanded: boolean;
  };
};

export default class ExpandOrCollapseIndicatorComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::BottomSection::ExpandOrCollapseIndicator': typeof ExpandOrCollapseIndicatorComponent;
  }
}
