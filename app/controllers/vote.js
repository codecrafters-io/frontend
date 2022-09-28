import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class VoteController extends Controller {
  @service('current-user') currentUserService;
  @service router;

  get activeTab() {
    console.log(this.router.currentRouteName);

    if (this.router.currentRouteName === 'vote.course-ideas') {
      return 'challenges';
    } else {
      return 'challenge-extensions';
    }
  }
}
