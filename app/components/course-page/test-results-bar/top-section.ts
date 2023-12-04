import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeTabSlug: string;
    onCollapseButtonClick: () => void;
    onActiveTabSlugChange: (slug: string) => void;
  };
};

export default class TopSectionComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get tabs() {
    const tabs = [
      {
        slug: 'logs',
        title: 'Logs',
        icon: 'terminal',
      },
    ];

    if (this.authenticator.currentUser!.isStaff) {
      tabs.push({
        slug: 'autofix',
        title: 'Autofix',
        icon: 'sparkles',
      });
    }

    return tabs;
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
