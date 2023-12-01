import { action } from '@ember/object';
import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    onCollapseButtonClick: () => void;
  };
};

export default class TopSectionComponent extends Component<Signature> {
  get tabs() {
    return [
      {
        slug: 'logs',
        title: 'Logs',
        icon: 'terminal',
      },
    ];
  }

  @action
  handleTabClick(tab: { slug: string }) {
    console.log(tab.slug);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::TopSection': typeof TopSectionComponent;
  }
}
