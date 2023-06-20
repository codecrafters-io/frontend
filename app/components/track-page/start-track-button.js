import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import window from 'ember-window-mock';

export default class CourseOverviewStartTrackButtonComponent extends Component {
  @service authentication;
  @service currentUser;
  @service router;

  @action
  handleClicked() {
    if (this.currentUserIsAnonymous) {
      this.authentication.initiateLogin();
    } else {
      this.router.transitionTo('course', this.args.courses.firstObject.slug, { queryParams: { track: this.args.language.slug } });
    }
  }

  get currentUserIsAnonymous() {
    return this.currentUser.isAnonymous;
  }
}
