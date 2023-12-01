import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    barIsExpanded: boolean;
  };
};

export default class ExpandOrCollapseButtonComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::BottomSection::ExpandOrCollapseButton': typeof ExpandOrCollapseButtonComponent;
  }
}
