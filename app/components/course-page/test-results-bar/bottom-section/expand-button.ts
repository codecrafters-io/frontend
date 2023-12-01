import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;
};

export default class ExpandButtonComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::BottomSection::ExpandButton': typeof ExpandButtonComponent;
  }
}
