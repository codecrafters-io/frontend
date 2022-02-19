import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CourseOverviewStartStageButtonComponent extends Component {
  @service currentUser;

  get currentUserIsAnonymous() {
    return this.currentUser.isAnonymous;
  }
}
