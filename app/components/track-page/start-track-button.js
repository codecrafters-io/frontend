import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CourseOverviewStartTrackButtonComponent extends Component {
  @service authenticator;
  @service router;

  get currentUserIsAnonymous() {
    return this.authenticator.isAnonymous;
  }

  @action
  handleClicked() {
    if (this.currentUserIsAnonymous) {
      this.authenticator.initiateLogin();
    } else {
      this.router.transitionTo('course', this.args.courses[0].slug, { queryParams: { track: this.args.language.slug } });
    }
  }
}
