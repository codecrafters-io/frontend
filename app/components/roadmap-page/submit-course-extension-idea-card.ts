import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import { action } from '@ember/object';
import { createPopup } from '@typeform/embed';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
  };
}

export default class SubmitCourseIdeaExtensionCardComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  @action
  handleClick() {
    createPopup('yJTtp9Ms', {
      hidden: {
        github_username: this.authenticator.currentUser!.username,
        course_name: this.args.course.name,
        sample_title: this.args.course.sampleExtensionIdeaTitle,
        sample_description: this.args.course.sampleExtensionIdeaDescription,
      },
    }).toggle();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'VotePage::SubmitCourseExtensionIdeaCard': typeof SubmitCourseIdeaExtensionCardComponent;
  }
}
