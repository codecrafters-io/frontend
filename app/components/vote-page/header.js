import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class HeaderComponent extends Component {
  @service router;

  get activeTab() {
    if (this.router.currentRouteName === 'vote.course-ideas') {
      return 'challenges';
    } else {
      return 'challenge-extensions';
    }
  }
}
