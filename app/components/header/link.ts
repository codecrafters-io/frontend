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

    return this.router.currentRouteName === this.args.route;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Header::Link': typeof LinkComponent;
  }
}
