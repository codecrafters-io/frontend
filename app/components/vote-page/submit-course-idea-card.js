import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { createPopup } from '@typeform/embed';

export default class SubmitCourseIdeaCardComponent extends Component {
  @service authenticator;

  @action
  handleClick() {
    createPopup('kJNvFVQM', {
      hidden: {
        github_username: this.authenticator.currentUser.username,
      },
    }).toggle();
  }
}
