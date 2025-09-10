import Component from '@glimmer/component';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;
}

export default class Header extends Component<Signature> {
  @service declare router: RouterService;

  get activeTab() {
    if (this.router.currentRouteName === 'roadmap.course-extension-ideas') {
      return 'challenge-extensions';
    } else {
      return 'challenges';
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'RoadmapPage::Header': typeof Header;
  }
}
