import { action } from '@ember/object';
import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeTabSlug: string;
    availableTabSlugs: string[];
    onCollapseButtonClick: () => void;
    onActiveTabSlugChange: (slug: string) => void;
  };
};

export default class TopSectionComponent extends Component<Signature> {
  get tabs() {
    const allTabs = [
      {
        slug: 'logs',
        title: 'Logs',
        icon: 'terminal',
      },
      {
        slug: 'autofix',
        title: 'AI Hints',
        icon: 'sparkles',
      },
    ];

    return allTabs.filter((tab) => this.args.availableTabSlugs.includes(tab.slug));
  }

  @action
  handleTabClick(tab: { slug: string }) {
    this.args.onActiveTabSlugChange(tab.slug);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::TopSection': typeof TopSectionComponent;
  }
}
