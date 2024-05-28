import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export type Tab = {
  slug: string;
  title: string;
  icon?: string;
};

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    tabs: Tab[];
    size?: 'regular' | 'small';

    // These can be set if the component needs to be "controlled"
    activeTabSlug?: string;
    onTabChange?: (tab: Tab) => void;
  };

  Blocks: {
    default: [string];
  };
};

export default class TabsComponent extends Component<Signature> {
  @tracked uncontrolledActiveTabSlug = this.args.tabs[0]!.slug;

  get activeTabSlug() {
    return this.args.activeTabSlug || this.uncontrolledActiveTabSlug;
  }

  @action
  handleTabChange(tab: Tab) {
    this.uncontrolledActiveTabSlug = tab.slug;

    if (this.args.onTabChange) {
      this.args.onTabChange(tab);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Tabs: typeof TabsComponent;
  }
}
