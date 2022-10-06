import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { createPopup } from '@typeform/embed';

export default class SubmitCourseIdeaExtensionCardComponent extends Component {
  @service('current-user') currentUserService;

  @action
  handleClick() {
    createPopup('yJTtp9Ms', {
      hidden: {
        github_username: this.currentUserService.record.username,
        course_name: this.args.course.name,
        sample_title: this.args.course.sampleExtensionIdeaTitle,
        sample_description: this.args.course.sampleExtensionIdeaDescription,
      },
    }).toggle();
  }
}
