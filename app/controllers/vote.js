import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class VoteController extends Controller {
  @service authenticator;
  @service router;

  get activeTab() {
    if (this.router.currentRouteName === 'vote.course-ideas') {
      return 'challenges';
    } else {
      return 'challenge-extensions';
    }
  }
}
