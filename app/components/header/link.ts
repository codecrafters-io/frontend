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

export default class LinkComponent extends Component<Signature> {
  @service declare router: RouterService;

  get isActive(): boolean {
    if (this.args.type !== 'route') {
      return false;
    }

    const currentRoute = this.router.currentRouteName;

    if (currentRoute === this.args.route) {
      return true;
    }

    if (currentRoute && currentRoute.includes('.') && this.args.route) {
      const parentRoute = currentRoute.split('.')[0];

      return parentRoute === this.args.route;
    }

    return false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Header::Link': typeof LinkComponent;
  }
}
