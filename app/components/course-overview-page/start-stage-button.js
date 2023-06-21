import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CourseOverviewStartStageButtonComponent extends Component {
  @service authenticator;

  get currentUserIsAnonymous() {
    return this.currentUser.isAnonymous;
  }
}
