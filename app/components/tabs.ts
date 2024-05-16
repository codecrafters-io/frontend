import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export type Signature = {
  Args: {
    tabs: {
      slug: string;
      title: string;
      icon?: string;
    }[];
    size?: 'regular' | 'small';
  };

  Blocks: {
    default: [string];
  };
};

export default class TabsComponent extends Component<Signature> {
  @tracked activeTabSlug;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.activeTabSlug = args.tabs[0]!.slug;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Tabs: typeof TabsComponent;
  }
}
