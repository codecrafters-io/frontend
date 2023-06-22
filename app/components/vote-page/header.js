import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class HeaderComponent extends Component {
  @service authenticator;
  @service router;

  get activeTab() {
    if (this.router.currentRouteName === 'vote.course-extension-ideas') {
      return 'challenge-extensions';
    } else {
      return 'challenges';
    }
  }
}
