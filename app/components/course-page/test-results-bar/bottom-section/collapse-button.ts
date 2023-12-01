import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;
};

export default class CollapseButtonComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::BottomSection::CollapseButton': typeof CollapseButtonComponent;
  }
}
