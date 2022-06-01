import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import window from 'ember-window-mock';

export default class CourseOverviewStartTrackButtonComponent extends Component {
  @service currentUser;

  @action
  handleClicked() {
    // TODO: Handle "resume-track functionality?"
    if (this.currentUserIsAnonymous) {
      window.location.href = '/login?next=' + this.router.currentURL;
    } else {
      this.router.transitionTo('course', this.args.courses.firstObject.slug);
    }
  }

  get currentUserHasStartedTrack() {
    return this.currentUser.isAuthenticated && this.currentUser.record.repositories.filterBy('language', this.args.language).firstObject;
  }

  get currentUserIsAnonymous() {
    return this.currentUser.isAnonymous;
  }
}
