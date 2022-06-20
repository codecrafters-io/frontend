import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import window from 'ember-window-mock';

export default class CourseOverviewStartTrackButtonComponent extends Component {
  @service currentUser;
  @service router;

  @action
  handleClicked() {
    if (this.currentUserIsAnonymous) {
      window.location.href = '/login?next=' + this.router.currentURL;
    } else {
      this.router.transitionTo('course', this.args.courses.firstObject.slug, { queryParams: { track: this.args.language.slug } });
    }
  }

  get currentUserIsAnonymous() {
    return this.currentUser.isAnonymous;
  }
}
