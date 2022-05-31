import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CourseOverviewStartTrackButtonComponent extends Component {
  @service currentUser;

  get currentUserHasStartedTrack() {
    return this.currentUser.isAuthenticated && this.currentUser.record.repositories.filterBy('language', this.args.language).firstObject;
  }

  get currentUserIsAnonymous() {
    return this.currentUser.isAnonymous;
  }
}
