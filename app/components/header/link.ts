import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    text: string;
    type: 'link' | 'route';
    route: string;
  };
}

export default class Link extends Component<Signature> {
  @service declare router: RouterService;

  get isActive(): boolean {
    if (this.args.type !== 'route') {
      return false;
    }

    const currentRoute = this.router.currentRouteName;
    const targetRoute = this.args.route;

    if (!currentRoute || !targetRoute) {
      return false;
    }

    return currentRoute === targetRoute || currentRoute.startsWith(targetRoute + '.');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Header::Link': typeof Link;
  }
}
