import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeTabSlug: string;
    availableTabSlugs: string[];
    onActiveTabSlugChange: (slug: string) => void;
  };

  Blocks: {
    default: [];
  };
}

export default class Pane extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::Pane': typeof Pane;
  }
}
