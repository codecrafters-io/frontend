import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CourseOverviewStartTrackButtonComponent extends Component {
  @service authenticator;
  @service authenticator;
  @service router;

  @action
  handleClicked() {
    if (this.currentUserIsAnonymous) {
      this.authenticator.initiateLogin();
    } else {
      this.router.transitionTo('course', this.args.courses.firstObject.slug, { queryParams: { track: this.args.language.slug } });
    }
  }

  get currentUserIsAnonymous() {
    return this.authenticator.isAnonymous;
  }
}
