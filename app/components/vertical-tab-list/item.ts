import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    label: string;
    route: string;
  };
};

export default class VerticalTabListItemComponent extends Component<Signature> {
  @service declare router: RouterService;

  get isActive() {
    return this.args.route === this.router.currentRouteName;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'VerticalTabList::Item': typeof VerticalTabListItemComponent;
  }
}
